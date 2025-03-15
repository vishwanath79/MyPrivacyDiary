from llama_index.core import (
    SimpleDirectoryReader,
    VectorStoreIndex,
    StorageContext,
    load_index_from_storage,
)
from llama_index.core.tools import QueryEngineTool, ToolMetadata
from llama_index.core.agent import ReActAgent
from llama_index.llms.openai import OpenAI
from os import environ
from dotenv import load_dotenv
import streamlit as st
import os
import time
import base64

# Load environment variables
load_dotenv()
OPENAI_API_KEY = environ["OPENAI_API_KEY"]

# Create an llm object to use for the QueryEngine and the ReActAgent
llm = OpenAI(model="gpt-4o")

import phoenix as px
session = px.launch_app()

# Helper function to load and display images
def get_img_as_base64(file_path):
    """Get image as base64 string for embedding in HTML/CSS"""
    if not os.path.isfile(file_path):
        return None
    with open(file_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode()

def add_logo():
    """Add logo to the sidebar"""
    logo_path = "tracker-analyzer/assets/logo.png"
    if os.path.exists(logo_path):
        st.sidebar.image(logo_path, width=150)
    else:
        # Create assets directory if it doesn't exist
        os.makedirs("tracker-analyzer/assets", exist_ok=True)
        st.sidebar.warning("Logo not found. Place a logo.png file in the tracker-analyzer/assets directory.")

def set_page_style():
    """Set custom page styling with background images and colors"""
    # Check if background image exists
    bg_image_path = "tracker-analyzer/assets/background.png"
    bg_image = get_img_as_base64(bg_image_path)
    
    # Custom CSS with conditional background
    custom_css = """
    <style>
        .stApp {
            background-color: #f5f7f9;
        }
        
        .main-header {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 20px;
        }
        
        .main-header img {
            max-height: 60px;
        }
        
        .main-header h1 {
            margin: 0;
            color: #1E3A8A;
        }
        
        .tab-icon {
            font-size: 1.2rem;
            margin-right: 5px;
        }
        
        .insights-card {
            background-color: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        
        .status-success {
            color: #10B981;
            font-weight: bold;
        }
        
        .status-error {
            color: #EF4444;
            font-weight: bold;
        }
    """
    
    # Add background image if available
    if bg_image:
        custom_css += f"""
        .stApp {{
            background-image: url("data:image/png;base64,{bg_image}");
            background-size: cover;
            background-repeat: no-repeat;
        }}
        """
    
    custom_css += "</style>"
    
    st.markdown(custom_css, unsafe_allow_html=True)

def load_all_data_and_create_tools():
    """Load all data from the data directory and create query tools"""
    try:
        base_dir = "tracker-analyzer/data"
        
        # Validate path exists before attempting to load
        if not os.path.exists(base_dir):
            os.makedirs(base_dir)
            raise FileNotFoundError(f"Data directory is empty. Please add data to {base_dir}")
            
        # Create a SimpleDirectoryReader to read all documents
        reader = SimpleDirectoryReader(base_dir, recursive=True)
        
        # Create a VectorStoreIndex
        try:
            documents = reader.load_data()
        except Exception as e:
            raise Exception(f"Error loading documents: {str(e)}")
            
        if not documents:
            raise ValueError("No documents found in the data directory")
            
        st.info(f"Loaded {len(documents)} documents from the data directory")
            
        index = VectorStoreIndex.from_documents(documents)
        
        # Create a QueryEngine
        query_engine = index.as_query_engine()
        
        # Create a QueryEngineTool with metadata
        query_engine_tool = QueryEngineTool(
            query_engine=query_engine,
            metadata=ToolMetadata(
                name="tracker_data_tool",
                description="Tool for querying tracker data and analytics information"
            )
        )
        
        # Create a list of tools
        query_engine_tools = [query_engine_tool]
        
        # Create a ReActAgent
        agent = ReActAgent.from_tools(
            query_engine_tools,
            llm=llm,
            verbose=True,
            max_turns=10,
        )
        
        return agent, index, documents, query_engine_tools
    except FileNotFoundError as e:
        st.error(f"File not found: {str(e)}")
        return None, None, None, None
    except Exception as e:
        st.error(f"Error loading data: {str(e)}")
        return None, None, None, None

def get_data_summary():
    """Get a summary of the data directory contents"""
    base_dir = "tracker-analyzer/data"
    if not os.path.exists(base_dir):
        os.makedirs(base_dir)
        return "No data directory found. Created empty directory."
    
    file_count = 0
    dir_count = 0
    file_types = {}
    
    # Walk through the directory structure
    for root, dirs, files in os.walk(base_dir):
        dir_count += len(dirs)
        
        for file_name in files:
            # Skip hidden files
            if file_name.startswith('.'):
                continue
                
            file_count += 1
            
            # Count file types
            ext = os.path.splitext(file_name)[1].lower()
            if ext in file_types:
                file_types[ext] += 1
            else:
                file_types[ext] = 1
    
    # Create summary
    summary = f"Found {file_count} files in {dir_count} directories.\n\n"
    
    if file_types:
        summary += "File types:\n"
        for ext, count in file_types.items():
            summary += f"- {ext}: {count} files\n"
    else:
        summary += "No files found in the data directory."
    
    return summary

def generate_profile(agent):
    """Generate a profile based on the browsing data"""
    profile_prompt = (
        "You are GPT-4o, an advanced analytic agent with multimodal capabilities. You are provided with a CSV file "
        "of a user's browsing history along with a statistical analysis report of that data. Your task is to form a "
        "meaningful profile of the user for that day. Consider the following in your analysis:\n\n"
        "- How did the user spend their time throughout the day?\n"
        "- What does the distribution of browsing activity tell you about their daily routine and sleep patterns?\n"
        "- What can be inferred about their emotional state based on the topics and categories of websites visited?\n"
        "- How do the average dwell time and its variability reflect their focus, impulsivity, or engagement?\n"
        "- What topics were prominent in their browsing and what might that suggest about their preoccupations?\n"
        "- What are the most prominent entries in the transition matrix and what can you infer from them?\n"
        "- What goals or tasks might the user have been pursuing?\n"
        "- Are there any clues to their demographic details (e.g., age, occupation, lifestyle) based on the browsing patterns?\n\n"
        "Explain your reasoning in depth."
    )
    
    try:
        response = agent.query(profile_prompt)
        return response.response
    except Exception as e:
        return f"Error generating profile: {str(e)}"

def create_context_aware_agent(tools, profile):
    """Create a second agent that incorporates the user profile into its responses"""
    # Create a custom prompt that includes the profile information and instructs to use "Your" instead of "the user"
    system_prompt = (
        "You are an advanced AI assistant with access to a person's browsing data and a profile "
        "derived from that data. When answering questions, incorporate relevant insights from the profile "
        "to provide personalized and context-aware responses. Here is the profile:\n\n"
        f"{profile}\n\n"
        "IMPORTANT: When responding, address the person directly using 'Your' or 'You' instead of referring to 'the user'. "
        "For example, say 'Your browsing patterns suggest you are interested in technology' rather than 'The user's browsing patterns suggest they are interested in technology'. "
        "This creates a more personal and direct conversation.\n\n"
        "Use the profile information to enhance your responses when appropriate, but always prioritize "
        "answering the specific question. If the profile doesn't contain relevant information for a "
        "particular query, focus on the data analysis without forcing profile insights."
    )
    
    # Create a new LLM with the custom system prompt
    context_aware_llm = OpenAI(model="gpt-4o", system_prompt=system_prompt)
    
    # Create a new agent with the context-aware LLM
    context_aware_agent = ReActAgent.from_tools(
        tools,
        llm=context_aware_llm,
        verbose=True,
        max_turns=10,
    )
    
    return context_aware_agent

def streamlit_app():
    """Main Streamlit application"""
    st.set_page_config(
        page_title="My Privacy Diary", 
        page_icon="🔒", 
        layout="wide",
        initial_sidebar_state="expanded"
    )
    
    # Apply custom styling
    set_page_style()
    
    # Add logo to sidebar
    #add_logo()
    
    # Custom header with logo
    header_logo_path = "tracker-analyzer/assets/header_icon.png"
    if os.path.exists(header_logo_path):
        header_html = f"""
        <div class="main-header">
            <img src="data:image/png;base64,{get_img_as_base64(header_logo_path)}" alt="Privacy Diary Logo">
            <h1>My Privacy Diary</h1>
        </div>
        """
        st.markdown(header_html, unsafe_allow_html=True)
    else:
        st.title("My Privacy Diary")
    
    st.write("Analyze your tracking data using AI")
    
    # Sidebar with data summary
    st.sidebar.header("Data Summary")
    
    # Add a small data icon
    data_icon_path = "tracker-analyzer/assets/data_icon.png"
    if os.path.exists(data_icon_path):
        st.sidebar.image(data_icon_path, width=30)
    
    data_summary = get_data_summary()
    st.sidebar.markdown(data_summary)
    
    # Load data button with icon
    load_btn_label = "📊 Load All Data"
    if "data_loaded" not in st.session_state or st.sidebar.button(load_btn_label):
        with st.spinner("Loading all data and creating tools..."):
            st.session_state.agent, st.session_state.index, st.session_state.documents, st.session_state.tools = load_all_data_and_create_tools()
            
            if st.session_state.agent and st.session_state.index:
                st.session_state.data_loaded = True
                st.sidebar.markdown("<p class='status-success'>✅ All data loaded successfully</p>", unsafe_allow_html=True)
                
                # Generate profile automatically
                with st.spinner("Generating profile..."):
                    st.session_state.profile = generate_profile(st.session_state.agent)
                    
                    # Create the context-aware agent (Agent 2)
                    st.session_state.context_aware_agent = create_context_aware_agent(
                        st.session_state.tools, 
                        st.session_state.profile
                    )
            else:
                st.sidebar.markdown("<p class='status-error'>❌ Failed to load data. Please check the data directory.</p>", unsafe_allow_html=True)
    
    # Display tabs with icons
    tab1, tab2, tab3 = st.tabs([
        "👤 Profile", 
        "🔍 Standard Query", 
        "💡 Personalized Insights"
    ])
    
    with tab1:
        # Profile header with icon
        profile_header_html = """
        <div class="insights-card">
            <h2>📊 Your Profile Analysis</h2>
            <p>Based on your browsing data, here's what we've learned about your digital behavior:</p>
        </div>
        """
        st.markdown(profile_header_html, unsafe_allow_html=True)
        
        if "profile" in st.session_state:
            st.markdown(st.session_state.profile)
        else:
            # Empty state with illustration
            empty_profile_path = "tracker-analyzer/assets/empty_profile.png"
            if os.path.exists(empty_profile_path):
                col1, col2, col3 = st.columns([1, 2, 1])
                with col2:
                    st.image(empty_profile_path, width=200)
            st.info("Please load data to generate a profile.")
            
        if st.button("🔄 Regenerate Profile"):
            if "data_loaded" in st.session_state:
                with st.spinner("Regenerating profile..."):
                    st.session_state.profile = generate_profile(st.session_state.agent)
                    # Update the context-aware agent with the new profile
                    st.session_state.context_aware_agent = create_context_aware_agent(
                        st.session_state.tools, 
                        st.session_state.profile
                    )
                    st.experimental_rerun()
            else:
                st.error("Please load data first.")
    
    with tab2:
        # Query header with icon
        query_header_html = """
        <div class="insights-card">
            <h2>🔍 Standard Query (Objective Analysis)</h2>
            <p>This agent analyzes the data without incorporating the profile.</p>
        </div>
        """
        st.markdown(query_header_html, unsafe_allow_html=True)
        
        query1 = st.text_area("Enter your query:", height=100, key="query1")
        
        if st.button("🔍 Submit Query", key="submit1"):
            if "data_loaded" not in st.session_state:
                st.error("Please load data first using the button in the sidebar.")
                return
                
            with st.spinner("Processing with Standard Agent..."):
                try:
                    response = st.session_state.agent.query(query1)
                    st.markdown("""
                    <div class="insights-card">
                        <h3>📋 Response</h3>
                    </div>
                    """, unsafe_allow_html=True)
                    st.write(response.response)
                except Exception as e:
                    st.error(f"Error: {str(e)}")
    
    with tab3:
        # Personalized header with icon
        personal_header_html = """
        <div class="insights-card">
            <h2>💡 Personalized Insights</h2>
            <p>This agent speaks directly to you, incorporating insights from your profile.</p>
        </div>
        """
        st.markdown(personal_header_html, unsafe_allow_html=True)
        
        query2 = st.text_area("Enter your query:", height=100, key="query2")
        
        if st.button("💡 Submit Query", key="submit2"):
            if "data_loaded" not in st.session_state:
                st.error("Please load data first using the button in the sidebar.")
                return
                
            with st.spinner("Processing your request..."):
                try:
                    response = st.session_state.context_aware_agent.query(query2)
                    st.markdown("""
                    <div class="insights-card">
                        <h3>✨ Your Insights</h3>
                    </div>
                    """, unsafe_allow_html=True)
                    st.write(response.response)
                except Exception as e:
                    st.error(f"Error: {str(e)}")
        
        # Add some suggested queries with icons
        st.markdown("""
        <div class="insights-card">
            <h3>🔮 Suggested Questions</h3>
        </div>
        """, unsafe_allow_html=True)
        
        suggested_queries = [
            {"icon": "📊", "text": "What are my main browsing patterns?"},
            {"icon": "🧠", "text": "What do my browsing habits suggest about my interests?"},
            {"icon": "😊", "text": "How might my emotional state affect my browsing?"},
            {"icon": "📱", "text": "What recommendations would you make for my digital habits?"},
            {"icon": "⏰", "text": "What time management insights can you provide for me?"},
            {"icon": "📈", "text": "How does my browsing compare to typical patterns?"},
            {"icon": "⚡", "text": "What productivity improvements would benefit me?"},
            {"icon": "🛡️", "text": "What digital wellbeing concerns are evident in my data?"}
        ]
        
        # Create columns for the suggested queries
        cols = st.columns(2)
        
        for i, query_item in enumerate(suggested_queries):
            col_idx = i % 2
            with cols[col_idx]:
                if st.button(f"{query_item['icon']} {query_item['text']}", key=f"suggested_query_{i}"):
                    if "data_loaded" not in st.session_state:
                        st.error("Please load data first using the button in the sidebar.")
                        return
                        
                    with st.spinner("Processing your request..."):
                        try:
                            response = st.session_state.context_aware_agent.query(query_item['text'])
                            st.markdown(f"""
                            <div class="insights-card">
                                <h4>{query_item['icon']} Your Insights</h4>
                            </div>
                            """, unsafe_allow_html=True)
                            st.write(response.response)
                        except Exception as e:
                            st.error(f"Error: {str(e)}")

if __name__ == "__main__":
    streamlit_app()
    
    