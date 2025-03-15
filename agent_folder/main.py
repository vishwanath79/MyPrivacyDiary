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

load_dotenv()

OPENAI_API_KEY = environ["OPENAI_API_KEY"]

# Create an llm object to use for the QueryEngine and the ReActAgent
llm = OpenAI(model="gpt-4")

session = px.launch_app()
print(session.host.index)