from os import environ
from dotenv import load_dotenv
import phoenix as px
from llama_index.core import (
    SimpleDirectoryReader,
    VectorStoreIndex,
    StorageContext,
    load_index_from_storage,
)
from llama_index.core.tools import QueryEngineTool, ToolMetadata
from llama_index.core.agent import ReActAgent
from llama_index.llms.openai import OpenAI
from openinference.instrumentation.llama_index import LlamaIndexInstrumentor
from phoenix.otel import register

load_dotenv()

OPENAI_API_KEY = environ["OPENAI_API_KEY"]

# Create an llm object to use for the QueryEngine and the ReActAgent
llm = OpenAI(model="gpt-4")

session = px.launch_app()
tracer_provider = register()
LlamaIndexInstrumentor().instrument(tracer_provider=tracer_provider)
print(session.host.index)

try:
    storage_context = StorageContext.from_defaults(
        persist_dir="./storage/lyft"
    )
    apple_index = load_index_from_storage(storage_context)

    storage_context = StorageContext.from_defaults(
        persist_dir="./storage/uber"
    )
    nyt_index = load_index_from_storage(storage_context)

    index_loaded = True
except:
    index_loaded = False

if not index_loaded:
    # load data
    apple_docs = SimpleDirectoryReader(
        input_files=["./data/apple.json"]
    ).load_data()
    nyt_docs = SimpleDirectoryReader(
        input_files=["./data/nyt.json"]
    ).load_data()

    # build index
    apple_index = VectorStoreIndex.from_documents(apple_docs, show_progress=True)
    nyt_index = VectorStoreIndex.from_documents(nyt_docs, swow_progress=True)

    # persist index
    apple_index.storage_context.persist(persist_dir="./storage/lyft")
    nyt_index.storage_context.persist(persist_dir="./storage/uber")

apple_engine = apple_index.as_query_engine(similarity_top_k=3, llm=llm)
nyt_engine = nyt_index.as_query_engine(similarity_top_k=3, llm=llm)


query_engine_tools = [
    QueryEngineTool(
        query_engine=apple_engine,
        metadata=ToolMetadata(
            name="Apple",
            description=(
                "Provides information about Apple website visit."
                "Use a detailed plain text question as input to the tool."
            ),
        ),
    ),
    QueryEngineTool(
        query_engine=nyt_engine,
        metadata=ToolMetadata(
            name="NYT",
            description=(
                "Provides information about NYT website visit."
                "Use a detailed plain text question as input to the tool."
            ),
        ),
    ),
]

agent = ReActAgent.from_tools(
    query_engine_tools,
    llm=llm,
    verbose=True,
    max_turns=10,
)

response = agent.chat("What can you infer about me using the data from my NYT website visit?")
print(str(response))