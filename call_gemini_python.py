import io, re
from google.oauth2 import service_account
import vertexai
from mimetypes import guess_type

from vertexai.generative_models import (
    GenerationConfig,
    GenerativeModel,
    HarmCategory,
    HarmBlockThreshold,
    Image
)

print('V2')
# Vertex AI configuration
project_id = 'paper-ds-production'
credentials_file_path = '../skilled-compass.json'
credentials = service_account.Credentials.from_service_account_file(credentials_file_path)
vertexai.init(project=project_id, credentials=credentials)
model = "gemini-2.5-flash-lite"
multimodal_model = GenerativeModel(model)

safety_config = {
    HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
    HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
    HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
    HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
}

# Generation Config
config = GenerationConfig(temperature=0.0, top_p=1, top_k=32)

def generate_bulk_prompt(news_list):
    prompt = "Given a list of Tiktok post, predict the following categories for each item: topic classification, urgency level, sentiment, target audience, affected region and Capture contextual or descriptive terms that support the main theme. Output should be in JSON format with each article's uuid included. \n\nGuidelines:\n\n"
    prompt += """
1. Topic Classification: Choose one of the following categories based on the main issue addressed:
   - Social and Economy
   - Infrastructure and Transportation
   - Public Health
   - Environment and Disaster
   - Safety and Crime
   - Government and Public Policy
   - Technology and Innovation
   - City Planning and Housing
   - Education and Culture
   - Tourism and Entertainment
   - Ecology and Green Spaces

2. Urgency Level: Provide a score from 0 to 100, where 100 indicates the highest urgency. This score represents how quickly the issue needs to be addressed to minimize its impact.

3. Sentiment: Classify sentiment as one of the following:
   - Positive
   - Neutral
   - Negative

4. Target Audience: Identify the primary groups affected by or interested in the news. Use the following categories:
   - Traditional Market Vendors
   - Business Owners
   - Local Government
   - General Public
   - Healthcare Workers
   - Environmental Agencies
   - Public Transport Users
   - Tourists
   - Students and Educators
   - Technology Enthusiasts
   - Safety and Security Agencies

5. Affected Region: Classify the region affected by the news as one of the following:
   - DKI Jakarta (for issues that generally affect all of Jakarta)
   - South Jakarta
   - North Jakarta
   - East Jakarta
   - West Jakarta
   - Central Jakarta
6. Contextual Keywords: Words and phrases that represent key themes, brands, products, individuals, locations, or technical specifications

Return the output in JSON format
Output:
[{
"uuid":<string>,
"topic_classification":<string>,
"urgency_level":<0-100>,
"sentiment":<string>,
"target_audience":<list of target>,
"affected_region":<string>,
"contextual_content": "This is a brief summary of the content related to the topic, capturing the main ideas and context. using indonesia language",
"contextual_keywords":<Top 5 list of contextual keyword or phrases in Indonesia Language>
}]

Process each news article separately using its uuid as an identifier.

Tiktok Articles:
"""
    prompt += f"""{news_list}"""
    return prompt

def call_gemini_bulk(news_list):
    # Generate a bulk prompt
    prompt = generate_bulk_prompt(news_list)
    
    # Generate content using the multimodal model
    responses = multimodal_model.generate_content([prompt],
                                                  safety_settings=safety_config, 
                                                  generation_config=config, 
                                                  stream=True)
    
    # Collect the full result
    full_result = ''
    for response in responses:
        full_result += response.text
    
    return full_result.strip()
