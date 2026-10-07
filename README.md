## About the data

### Data source
The data comes from the Australian Government's Energy Rating (Greenhouse
and Energy Minimum Standards) television product registry, exported on
15 February 2026 (`tv_2026_02_15.csv`). It contains 4,724 registered TV models, most of which are sold in
Australia (about 4% are listed for New Zealand and/or Fiji only), with
32 columns including screen size, screen technology, star rating and
labelled energy consumption (kWh/year). Source: [Energy Rating for household appliances, data.gov.au](https://data.gov.au/data/dataset/energy-rating-for-household-appliances)

### Data processing
Processing was done in KNIME:
1. Selected two fields: screen size and labelled energy consumption
   (kWh/year).
2. Converted screen size from centimetres to inches (cm / 2.54) and
   rounded to the nearest inch, giving 48 distinct sizes (16" to 116").
3. Created a size category using a rule: Small (43" or less), Medium
   (44" to 65"), Large (over 65").
4. Calculated the mean annual energy consumption for each inch size and
   for each category, producing two CSV files used for the charts.

### Privacy
The dataset describes products (brands, models, energy ratings), not
people. It contains no personal or household-level information, so there
are no privacy concerns for individuals. Brand and model names are public
regulatory records.

### Accuracy and limitations
- Energy values are *labelled* (laboratory test) figures, not measured
  household use. Real consumption depends on viewing hours, brightness
  settings and standby behaviour.
- The data shows an association, not proof that screen size alone causes
  higher use. Screen technology (LCD, LED, OLED), resolution and
  brightness also differ between models.
- Averages hide spread within each size, and some sizes have very few
  models (15 of the 48 sizes have 5 or fewer), so single-size averages
  can be noisy. For example, 76" has only one model, which is why its
  average is lower than those of 74" and 77".
- Some models appear more than once (the same brand and model number
  appears in several rows), which may slightly weight those products.
- The data is a February 2026 snapshot of registered models, not of TVs
  that households currently own.
- About 4% of models (202 of 4,724) are not listed as sold in Australia
  but were kept in the analysis, so the averages describe the whole
  registry rather than the Australian market alone.

### Ethics
The data is public regulatory data used for educational purposes. The
story aims to be honest and not to push consumers toward any brand.
Averages are not exaggerated: charts start from zero and the limitations
above are stated openly. The message is not that large TVs are "bad",
but that screen size is one factor in running cost.

## AI Declaration
I used Claude (Anthropic) to help review the
structure of my README, draft wording, check
that numbers matched my KNIME output. I checked the results against my
own data and edited the text before submitting. 
