# name_getter.py
import sys
import os
import json

# U.S. state abbreviations and names
states = [
  {"abbreviation": "AK", "name": "Alaska"},
  {"abbreviation": "AL", "name": "Alabama"},
  {"abbreviation": "AR", "name": "Arkansas"},
  {"abbreviation": "AZ", "name": "Arizona"},
  {"abbreviation": "CA", "name": "California"},
  {"abbreviation": "CO", "name": "Colorado"},
  {"abbreviation": "CT", "name": "Connecticut"},
  {"abbreviation": "DC", "name": "District of Columbia"},
  {"abbreviation": "DE", "name": "Delaware"},
  {"abbreviation": "FL", "name": "Florida"},
  {"abbreviation": "GA", "name": "Georgia"},
  {"abbreviation": "HI", "name": "Hawaii"},
  {"abbreviation": "IA", "name": "Iowa"},
  {"abbreviation": "ID", "name": "Idaho"},
  {"abbreviation": "IL", "name": "Illinois"},
  {"abbreviation": "IN", "name": "Indiana"},
  {"abbreviation": "KS", "name": "Kansas"},
  {"abbreviation": "KY", "name": "Kentucky"},
  {"abbreviation": "LA", "name": "Louisiana"},
  {"abbreviation": "MA", "name": "Massachusetts"},
  {"abbreviation": "MD", "name": "Maryland"},
  {"abbreviation": "ME", "name": "Maine"},
  {"abbreviation": "MI", "name": "Michigan"},
  {"abbreviation": "MN", "name": "Minnesota"},
  {"abbreviation": "MO", "name": "Missouri"},
  {"abbreviation": "MS", "name": "Mississippi"},
  {"abbreviation": "MT", "name": "Montana"},
  {"abbreviation": "NC", "name": "North Carolina"},
  {"abbreviation": "ND", "name": "North Dakota"},
  {"abbreviation": "NE", "name": "Nebraska"},
  {"abbreviation": "NH", "name": "New Hampshire"},
  {"abbreviation": "NJ", "name": "New Jersey"},
  {"abbreviation": "NM", "name": "New Mexico"},
  {"abbreviation": "NV", "name": "Nevada"},
  {"abbreviation": "NY", "name": "New York"},
  {"abbreviation": "OH", "name": "Ohio"},
  {"abbreviation": "OK", "name": "Oklahoma"},
  {"abbreviation": "OR", "name": "Oregon"},
  {"abbreviation": "PA", "name": "Pennsylvania"},
  {"abbreviation": "RI", "name": "Rhode Island"},
  {"abbreviation": "SC", "name": "South Carolina"},
  {"abbreviation": "SD", "name": "South Dakota"},
  {"abbreviation": "TN", "name": "Tennessee"},
  {"abbreviation": "TX", "name": "Texas"},
  {"abbreviation": "UT", "name": "Utah"},
  {"abbreviation": "VA", "name": "Virginia"},
  {"abbreviation": "VT", "name": "Vermont"},
  {"abbreviation": "WA", "name": "Washington"},
  {"abbreviation": "WI", "name": "Wisconsin"},
  {"abbreviation": "WV", "name": "West Virginia"},
  {"abbreviation": "WY", "name": "Wyoming"},
]

print("✅ Script started")

# Path to extracted SSA files
if len(sys.argv) > 1:
    path_to_unzipped_data = sys.argv[1]
else:
    path_to_unzipped_data = os.path.expanduser('~') + '/Downloads/namesbystate'

# Output folder
output_folder = os.path.join(os.path.dirname(__file__), "assets", "json")
os.makedirs(output_folder, exist_ok=True)

aggregate_data = {
    "maleData": {},
    "femaleData": {}
}

for state in states:
    print(f"🔍 Processing {state['abbreviation']} ({state['name']})...")

    file_path = os.path.join(path_to_unzipped_data, f"{state['abbreviation']}.TXT")

    if not os.path.exists(file_path):
        print(f"❌ File not found: {file_path}")
        continue

    state_dict = {
        "stateName": state["name"],
        "abbreviation": state["abbreviation"],
        "maleData": {},
        "femaleData": {},
    }

    with open(file_path, "r") as file:
        for line in file:
            parts = line.strip().split(",")
            if len(parts) < 5:
                continue

            state_abbr, sex, year, name, count = parts
            count = int(count)
            gender_key = "maleData" if sex == "M" else "femaleData"

            # Add to state-level data
            if year not in state_dict[gender_key]:
                state_dict[gender_key][year] = {"names": {}}
            state_dict[gender_key][year]["names"][name] = count

            # Add to aggregate data
            if year not in aggregate_data[gender_key]:
                aggregate_data[gender_key][year] = {"names": {}}
            if name in aggregate_data[gender_key][year]["names"]:
                aggregate_data[gender_key][year]["names"][name] += count
            else:
                aggregate_data[gender_key][year]["names"][name] = count

    # Save state-level JSON
    output_path = os.path.join(output_folder, f"{state['abbreviation']}.json")
    with open(output_path, "w") as f:
        json.dump(state_dict, f)
    print(f"✅ Saved: {output_path}")

# Save aggregate.json
aggregate_path = os.path.join(output_folder, "aggregate.json")
with open(aggregate_path, "w") as f:
    json.dump(aggregate_data, f)
print(f"✅ Saved: {aggregate_path}")
