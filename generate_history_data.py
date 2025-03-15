import pandas as pd
import numpy as np
import random
import datetime
import os
from urllib.parse import urlparse

# Ensure data directory exists
os.makedirs("tracker-analyzer/data", exist_ok=True)

# Increase the number of days to generate data for
NUM_DAYS = 60  # Generate two months of data
# Increase session density to generate more entries per day
SESSION_DENSITY_MULTIPLIER = 1.5

# Define common website categories and example sites
CATEGORIES = {
    "Social Media": [
        "facebook.com", "twitter.com", "instagram.com", "linkedin.com", "tiktok.com", 
        "reddit.com", "pinterest.com", "snapchat.com", "discord.com", "whatsapp.com",
        "tumblr.com", "quora.com", "telegram.org", "mastodon.social", "threads.net"
    ],
    "News": [
        "nytimes.com", "cnn.com", "bbc.com", "reuters.com", "apnews.com", 
        "washingtonpost.com", "theguardian.com", "bloomberg.com", "wsj.com",
        "foxnews.com", "nbcnews.com", "abcnews.go.com", "npr.org", "aljazeera.com"
    ],
    "Shopping": [
        "amazon.com", "ebay.com", "walmart.com", "etsy.com", "target.com", 
        "bestbuy.com", "aliexpress.com", "wayfair.com", "homedepot.com",
        "costco.com", "ikea.com", "newegg.com", "macys.com", "nordstrom.com"
    ],
    "Entertainment": [
        "youtube.com", "netflix.com", "hulu.com", "disneyplus.com", "spotify.com", 
        "twitch.tv", "hbomax.com", "primevideo.com", "soundcloud.com",
        "tiktok.com", "vimeo.com", "crunchyroll.com", "dailymotion.com", "pandora.com"
    ],
    "Productivity": [
        "google.com", "docs.google.com", "sheets.google.com", "drive.google.com", 
        "office.com", "notion.so", "trello.com", "asana.com", "slack.com", "zoom.us",
        "dropbox.com", "evernote.com", "monday.com", "clickup.com", "miro.com"
    ],
    "Technology": [
        "github.com", "stackoverflow.com", "medium.com", "dev.to", "techcrunch.com", 
        "wired.com", "theverge.com", "arstechnica.com", "hackernews.com",
        "cnet.com", "engadget.com", "gizmodo.com", "slashdot.org", "producthunt.com"
    ],
    "Education": [
        "coursera.org", "udemy.com", "edx.org", "khanacademy.org", "duolingo.com", 
        "wikipedia.org", "quizlet.com", "chegg.com", "canvas.com",
        "brilliant.org", "skillshare.com", "ted.com", "mathworks.com", "codecademy.com"
    ],
    "Finance": [
        "chase.com", "bankofamerica.com", "wellsfargo.com", "paypal.com", "mint.com", 
        "robinhood.com", "coinbase.com", "fidelity.com", "vanguard.com",
        "schwab.com", "capitalone.com", "discover.com", "creditkarma.com", "nerdwallet.com"
    ],
    "Health": [
        "webmd.com", "mayoclinic.org", "healthline.com", "nih.gov", "cdc.gov",
        "fitbit.com", "myfitnesspal.com", "strava.com", "peloton.com", "calm.com"
    ],
    "Travel": [
        "booking.com", "airbnb.com", "expedia.com", "tripadvisor.com", "kayak.com",
        "hotels.com", "southwest.com", "delta.com", "united.com", "maps.google.com"
    ]
}

# Flatten the list of websites
ALL_WEBSITES = []
for category, sites in CATEGORIES.items():
    ALL_WEBSITES.extend([(site, category) for site in sites])

# Define time patterns for a typical day
MORNING_HOURS = list(range(6, 12))
AFTERNOON_HOURS = list(range(12, 18))
EVENING_HOURS = list(range(18, 24))
NIGHT_HOURS = list(range(0, 6))

# Weighted time distribution (more activity during day, less at night)
TIME_WEIGHTS = {
    "morning": 0.3,
    "afternoon": 0.4,
    "evening": 0.25,
    "night": 0.05
}

# Define user personas with different browsing patterns
PERSONAS = [
    {
        "name": "Work Professional",
        "category_weights": {
            "Social Media": 0.15,
            "News": 0.15,
            "Shopping": 0.05,
            "Entertainment": 0.05,
            "Productivity": 0.35,
            "Technology": 0.15,
            "Education": 0.05,
            "Finance": 0.05,
            "Health": 0.03,
            "Travel": 0.02
        },
        "time_pattern": {
            "morning": 0.3,
            "afternoon": 0.5,
            "evening": 0.15,
            "night": 0.05
        },
        "avg_dwell_time": {
            "Social Media": (2, 10),
            "News": (3, 8),
            "Shopping": (5, 15),
            "Entertainment": (10, 30),
            "Productivity": (15, 45),
            "Technology": (5, 20),
            "Education": (10, 30),
            "Finance": (3, 10),
            "Health": (4, 12),
            "Travel": (5, 20)
        }
    },
    {
        "name": "Student",
        "category_weights": {
            "Social Media": 0.25,
            "News": 0.05,
            "Shopping": 0.05,
            "Entertainment": 0.15,
            "Productivity": 0.15,
            "Technology": 0.05,
            "Education": 0.25,
            "Finance": 0.05,
            "Health": 0.03,
            "Travel": 0.02
        },
        "time_pattern": {
            "morning": 0.1,
            "afternoon": 0.3,
            "evening": 0.4,
            "night": 0.2
        },
        "avg_dwell_time": {
            "Social Media": (5, 20),
            "News": (2, 5),
            "Shopping": (5, 15),
            "Entertainment": (15, 45),
            "Productivity": (20, 60),
            "Technology": (5, 15),
            "Education": (25, 90),
            "Finance": (2, 5),
            "Health": (3, 10),
            "Travel": (5, 15)
        }
    },
    {
        "name": "Entertainment Enthusiast",
        "category_weights": {
            "Social Media": 0.3,
            "News": 0.05,
            "Shopping": 0.1,
            "Entertainment": 0.4,
            "Productivity": 0.05,
            "Technology": 0.05,
            "Education": 0.03,
            "Finance": 0.02,
            "Health": 0.03,
            "Travel": 0.07
        },
        "time_pattern": {
            "morning": 0.1,
            "afternoon": 0.2,
            "evening": 0.5,
            "night": 0.2
        },
        "avg_dwell_time": {
            "Social Media": (5, 25),
            "News": (2, 5),
            "Shopping": (10, 30),
            "Entertainment": (30, 120),
            "Productivity": (5, 15),
            "Technology": (3, 10),
            "Education": (5, 15),
            "Finance": (2, 5),
            "Health": (3, 8),
            "Travel": (10, 30)
        }
    },
    {
        "name": "Tech Enthusiast",
        "category_weights": {
            "Social Media": 0.1,
            "News": 0.1,
            "Shopping": 0.05,
            "Entertainment": 0.1,
            "Productivity": 0.2,
            "Technology": 0.35,
            "Education": 0.08,
            "Finance": 0.02,
            "Health": 0.03,
            "Travel": 0.02
        },
        "time_pattern": {
            "morning": 0.2,
            "afternoon": 0.3,
            "evening": 0.4,
            "night": 0.1
        },
        "avg_dwell_time": {
            "Social Media": (3, 12),
            "News": (4, 10),
            "Shopping": (8, 20),
            "Entertainment": (10, 25),
            "Productivity": (15, 40),
            "Technology": (20, 60),
            "Education": (15, 45),
            "Finance": (2, 8),
            "Health": (4, 12),
            "Travel": (5, 15)
        }
    },
    {
        "name": "Health Conscious",
        "category_weights": {
            "Social Media": 0.1,
            "News": 0.1,
            "Shopping": 0.1,
            "Entertainment": 0.05,
            "Productivity": 0.1,
            "Technology": 0.05,
            "Education": 0.1,
            "Finance": 0.05,
            "Health": 0.3,
            "Travel": 0.05
        },
        "time_pattern": {
            "morning": 0.4,
            "afternoon": 0.3,
            "evening": 0.25,
            "night": 0.05
        },
        "avg_dwell_time": {
            "Social Media": (3, 10),
            "News": (3, 8),
            "Shopping": (5, 15),
            "Entertainment": (5, 20),
            "Productivity": (10, 30),
            "Technology": (3, 10),
            "Education": (10, 30),
            "Finance": (3, 8),
            "Health": (15, 60),
            "Travel": (5, 15)
        }
    }
]

def generate_random_timestamp(day_range=7):
    """Generate a random timestamp within the last few days"""
    now = datetime.datetime.now()
    random_days = random.randint(0, day_range)
    random_seconds = random.randint(0, 86400)  # Seconds in a day
    
    timestamp = now - datetime.timedelta(days=random_days, seconds=random_seconds)
    return timestamp

def get_time_period(hour):
    """Determine the time period based on the hour"""
    if hour in MORNING_HOURS:
        return "morning"
    elif hour in AFTERNOON_HOURS:
        return "afternoon"
    elif hour in EVENING_HOURS:
        return "evening"
    else:
        return "night"

def generate_url_path(base_url, category):
    """Generate a realistic URL path based on the website and category"""
    parsed_url = urlparse(f"https://{base_url}")
    domain = parsed_url.netloc
    
    # Common paths based on category
    paths = {
        "Social Media": ["feed", "profile", "messages", "notifications", "friends", "groups", "trending", "explore", "photos", "events"],
        "News": ["world", "politics", "business", "technology", "science", "health", "sports", "arts", "opinion", "local"],
        "Shopping": ["products", "cart", "checkout", "category", "deals", "wishlist", "orders", "reviews", "sale", "new-arrivals"],
        "Entertainment": ["watch", "movies", "shows", "music", "playlists", "live", "trending", "channels", "podcasts", "games"],
        "Productivity": ["documents", "spreadsheets", "presentations", "calendar", "tasks", "projects", "notes", "meetings", "dashboard", "templates"],
        "Technology": ["blog", "tutorials", "news", "reviews", "code", "forum", "docs", "downloads", "support", "community"],
        "Education": ["courses", "lessons", "quizzes", "assignments", "lectures", "resources", "library", "study", "practice", "certificates"],
        "Finance": ["accounts", "transactions", "investments", "budget", "bills", "reports", "credit", "loans", "savings", "retirement"],
        "Health": ["fitness", "nutrition", "medical", "wellness", "workout", "recipes", "sleep", "meditation", "tracking", "symptoms"],
        "Travel": ["hotels", "flights", "destinations", "reviews", "booking", "itinerary", "guides", "photos", "deals", "experiences"]
    }
    
    # Select a random path for the category
    if category in paths:
        path_options = paths[category]
        path = random.choice(path_options)
        
        # Add some randomness to the path
        if random.random() < 0.3:
            path += f"/{random.randint(1, 1000)}"
        
        # Add query parameters sometimes
        if random.random() < 0.2:
            query_params = ["ref=homepage", "source=search", "utm_medium=social", "utm_source=email", "campaign=summer", "ref=recommended"]
            path += f"?{random.choice(query_params)}"
            
        return f"https://{domain}/{path}"
    else:
        return f"https://{domain}/"

def generate_title(url, category):
    """Generate a plausible page title based on the URL and category"""
    domain = urlparse(url).netloc
    path = urlparse(url).path.strip('/')
    
    # Base title templates
    templates = {
        "Social Media": [
            "{} | Your Feed",
            "Home | {}",
            "{} - Connect with Friends",
            "Your {} Timeline",
            "Notifications | {}"
        ],
        "News": [
            "Breaking: {} News",
            "{} - Latest Headlines",
            "Top Stories | {}",
            "World News - {}",
            "{} | In-depth Coverage"
        ],
        "Shopping": [
            "{} - Online Shopping",
            "Shop the Latest Deals | {}",
            "Your Cart | {}",
            "Best Sellers - {}",
            "{} - Free Shipping on Orders"
        ],
        "Entertainment": [
            "Watch Now on {}",
            "Trending Videos | {}",
            "{} - Stream Your Favorites",
            "New Releases | {}",
            "Popular on {}"
        ],
        "Productivity": [
            "{} Docs - Online Documents",
            "Your Workspace | {}",
            "{} - Collaborate in Real-time",
            "Project Management - {}",
            "Calendar | {}"
        ],
        "Technology": [
            "Developer Resources | {}",
            "{} - Tech News and Reviews",
            "Coding Solutions - {}",
            "Latest in Tech | {}",
            "{} Forums - Ask Questions"
        ],
        "Education": [
            "Online Courses | {}",
            "Learn at Your Own Pace - {}",
            "{} - Expand Your Knowledge",
            "Study Resources | {}",
            "Tutorials and Guides - {}"
        ],
        "Finance": [
            "Secure Banking | {}",
            "{} - Manage Your Finances",
            "Investment Tracking - {}",
            "Your Accounts | {}",
            "{} - Financial Planning Tools"
        ],
        "Health": [
            "Health & Wellness | {}",
            "{} - Fitness Tracking",
            "Nutrition Guide - {}",
            "Workout Plans | {}",
            "{} - Live Healthier"
        ],
        "Travel": [
            "Book Your Next Trip | {}",
            "{} - Explore Destinations",
            "Travel Deals - {}",
            "Vacation Planning | {}",
            "{} - Adventure Awaits"
        ]
    }
    
    # Select a template based on category
    if category in templates:
        template = random.choice(templates[category])
        title = template.format(domain.split('.')[0].title())
        
        # Add path information to title sometimes
        if path and random.random() < 0.5:
            path_parts = path.split('/')
            if path_parts:
                title += f" - {path_parts[0].replace('-', ' ').title()}"
        
        return title
    else:
        return f"{domain.split('.')[0].title()} - Official Website"

def generate_browsing_history_for_day(persona, base_date):
    """Generate browsing history data for a single day based on a persona"""
    history_data = []
    
    # Set the start time to the beginning of the day
    current_time = base_date.replace(hour=0, minute=0, second=0, microsecond=0)
    
    # Track the last visited site for realistic transitions
    last_site = None
    last_category = None
    
    # Create a transition matrix for more realistic browsing patterns
    transition_matrix = {}
    for cat1 in CATEGORIES.keys():
        transition_matrix[cat1] = {}
        for cat2 in CATEGORIES.keys():
            # Higher probability to stay in the same category
            if cat1 == cat2:
                transition_matrix[cat1][cat2] = 0.6
            else:
                transition_matrix[cat1][cat2] = 0.4 / (len(CATEGORIES) - 1)
    
    # Adjust transition probabilities based on persona
    if persona["name"] == "Work Professional":
        transition_matrix["Productivity"]["Technology"] = 0.3
        transition_matrix["Technology"]["Productivity"] = 0.3
    elif persona["name"] == "Student":
        transition_matrix["Education"]["Social Media"] = 0.3
        transition_matrix["Social Media"]["Education"] = 0.2
    elif persona["name"] == "Entertainment Enthusiast":
        transition_matrix["Entertainment"]["Social Media"] = 0.3
        transition_matrix["Social Media"]["Entertainment"] = 0.3
    elif persona["name"] == "Tech Enthusiast":
        transition_matrix["Technology"]["Productivity"] = 0.3
        transition_matrix["Technology"]["Education"] = 0.2
    elif persona["name"] == "Health Conscious":
        transition_matrix["Health"]["Education"] = 0.3
        transition_matrix["Health"]["Shopping"] = 0.2
    
    # Generate browsing sessions throughout the day
    while current_time < base_date + datetime.timedelta(days=1):
        # Determine if this is a browsing session time based on the time of day
        time_period = get_time_period(current_time.hour)
        session_probability = persona["time_pattern"][time_period] * SESSION_DENSITY_MULTIPLIER
        
        # Add some day-to-day variation
        session_probability *= random.uniform(0.8, 1.2)
        
        # Cap probability at 1.0
        session_probability = min(session_probability, 1.0)
        
        if random.random() < session_probability:
            # Start a browsing session
            session_length = random.randint(3, 20)  # Increased session length for more entries
            
            for _ in range(session_length):
                # Choose a category based on transition probabilities or persona preferences
                if last_category and random.random() < 0.7:  # 70% chance to use transition matrix
                    category_weights = transition_matrix[last_category]
                    categories = list(category_weights.keys())
                    weights = list(category_weights.values())
                    category = random.choices(categories, weights=weights, k=1)[0]
                else:
                    # Use persona's category preferences
                    categories = list(persona["category_weights"].keys())
                    weights = list(persona["category_weights"].values())
                    category = random.choices(categories, weights=weights, k=1)[0]
                
                # Choose a website from the category
                website = random.choice(CATEGORIES[category])
                
                # Generate URL with path
                url = generate_url_path(website, category)
                
                # Generate title
                title = generate_title(url, category)
                
                # Determine dwell time based on category and persona
                min_time, max_time = persona["avg_dwell_time"][category]
                dwell_time = random.randint(min_time, max_time) * 60  # Convert to seconds
                
                # Add some randomness to dwell time
                dwell_time = int(dwell_time * random.uniform(0.8, 1.2))
                
                # Add entry to history
                history_data.append({
                    "timestamp": current_time.strftime("%Y-%m-%d %H:%M:%S"),
                    "url": url,
                    "title": title,
                    "dwell_time": dwell_time,
                    "category": category
                })
                
                # Update current time and last site
                current_time += datetime.timedelta(seconds=dwell_time)
                last_site = website
                last_category = category
                
                # Add some random time between page visits (1-30 seconds)
                browse_gap = random.randint(1, 30)
                current_time += datetime.timedelta(seconds=browse_gap)
        
        # Move time forward if no browsing session
        else:
            # Jump forward by 5-20 minutes (reduced to increase density)
            current_time += datetime.timedelta(minutes=random.randint(5, 20))
    
    return history_data

def generate_browsing_history(persona, num_days=NUM_DAYS):
    """Generate browsing history data for multiple days based on a persona"""
    all_history_data = []
    
    # Generate data for each day
    for day in range(num_days):
        base_date = datetime.datetime.now() - datetime.timedelta(days=num_days - day)
        day_data = generate_browsing_history_for_day(persona, base_date)
        all_history_data.extend(day_data)
        
        # Print progress
        print(f"Generated data for day {day+1}/{num_days} - {len(day_data)} entries (Total: {len(all_history_data)})")
        
        # Check if we've reached 10,000 entries
        if len(all_history_data) >= 10000 and day >= 14:  # Ensure at least 2 weeks of data
            print(f"Reached target of 10,000+ entries after {day+1} days. Stopping generation.")
            break
    
    return all_history_data

def main():
    # Choose a random persona
    persona = random.choice(PERSONAS)
    print(f"Generating browsing history for persona: {persona['name']}")
    
    # Generate browsing history for multiple days
    history_data = generate_browsing_history(persona)
    
    # Convert to DataFrame
    df = pd.DataFrame(history_data)
    
    # Sort by timestamp
    df = df.sort_values("timestamp")
    
    # Calculate some statistics for the analysis report
    total_browsing_time = df["dwell_time"].sum() / 3600  # in hours
    category_distribution = df["category"].value_counts(normalize=True).to_dict()
    hourly_activity = df["timestamp"].apply(lambda x: datetime.datetime.strptime(x, "%Y-%m-%d %H:%M:%S").hour).value_counts().sort_index()
    avg_dwell_time_by_category = df.groupby("category")["dwell_time"].mean().to_dict()
    
    # Create a transition matrix
    transitions = {}
    for cat1 in CATEGORIES.keys():
        transitions[cat1] = {}
        for cat2 in CATEGORIES.keys():
            transitions[cat1][cat2] = 0
    
    # Fill the transition matrix
    for i in range(len(df) - 1):
        from_cat = df.iloc[i]["category"]
        to_cat = df.iloc[i+1]["category"]
        transitions[from_cat][to_cat] += 1
    
    # Normalize the transition matrix
    for cat1 in transitions:
        total = sum(transitions[cat1].values())
        if total > 0:
            for cat2 in transitions[cat1]:
                transitions[cat1][cat2] /= total
    
    # Save the browsing history to CSV
    df.to_csv("tracker-analyzer/data/history.csv", index=False)
    print(f"Saved browsing history to tracker-analyzer/data/history.csv ({len(df)} entries)")
    
    # Create an analysis report
    analysis_report = f"""# Browsing History Analysis Report

## Overview
- **Total Entries:** {len(df)}
- **Date Range:** {df["timestamp"].min()} to {df["timestamp"].max()}
- **Total Browsing Time:** {total_browsing_time:.2f} hours
- **Persona Type:** {persona["name"]}
- **Days Analyzed:** {len(df["timestamp"].apply(lambda x: datetime.datetime.strptime(x, "%Y-%m-%d %H:%M:%S").date()).unique())}

## Category Distribution
{pd.Series(category_distribution).to_string()}

## Hourly Activity Pattern
{hourly_activity.to_string()}

## Average Dwell Time by Category (seconds)
{pd.Series(avg_dwell_time_by_category).to_string()}

## Daily Browsing Patterns
{df.groupby(df["timestamp"].apply(lambda x: datetime.datetime.strptime(x, "%Y-%m-%d %H:%M:%S").date()))["dwell_time"].sum().div(3600).to_string()}

## Top Visited Websites
{df["url"].apply(lambda x: urlparse(x).netloc).value_counts().head(20).to_string()}

## Weekly Patterns
{df.groupby([df["timestamp"].apply(lambda x: datetime.datetime.strptime(x, "%Y-%m-%d %H:%M:%S").date().isocalendar()[1]), df["category"]]).size().unstack().fillna(0).to_string()}

## Transition Matrix
"""
    
    # Add transition matrix to report
    for cat1 in CATEGORIES.keys():
        analysis_report += f"\n### From {cat1} to:\n"
        for cat2, prob in transitions[cat1].items():
            if prob > 0:
                analysis_report += f"- {cat2}: {prob:.2f}\n"
    
    # Save the analysis report
    with open("tracker-analyzer/data/analysis_report.md", "w") as f:
        f.write(analysis_report)
    
    print("Saved analysis report to tracker-analyzer/data/analysis_report.md")

if __name__ == "__main__":
    main() 