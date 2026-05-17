# Research 2 — Manuscript Outline

## Where the EPI cascade breaks: separating entry-point from follow-up failure across 38 sub-Saharan African countries

**Authors:** [TBD]

**Target journals (suggested):** *The Lancet Global Health*, *BMJ Global Health*, *Vaccine*, *Bulletin of the WHO*

---

## Abstract (placeholder, ~250 words)

- **Background.** Standard vaccination coverage statistics treat each antigen as independent, masking whether unvaccinated children were never reached or started but did not complete the schedule. The two failures require different policy responses.
- **Methods.** Using 163 Demographic and Health Surveys from 38 sub-Saharan countries (1989–2024, n=263,385 children aged 12–23 months), we constructed dose-by-dose cascades from BCG through MCV1, computed conditional dose-completion probabilities, and decomposed missed vaccinations into entry-point failure (zero-dose) and follow-up failure (started but did not complete DPT3). We then formalized the cascade as a five-state Markov chain, fitted country-specific transition probabilities via random-effects meta-analysis on the logit scale with empirical Bayes shrinkage, and predicted terminal-state occupation per country.
- **Findings.** Continental cascade completion declined gradually rather than at a single break point: BCG 88.1%, DPT/Penta 1 85.9%, DPT/Penta 2 81.0%, DPT/Penta 3 74.2%, MCV1 74.7%. The largest single transition leak was DPT2→DPT3 (mean −6.8 pp). Countries split into four policy quadrants: 21 functioning ("both low"), 6 entry-point dominant (notably Nigeria, with 54% zero-dose), 4 follow-up dominant (including South Africa), and 7 requiring comprehensive rebuild (Angola, Chad, DR Congo, Ethiopia, Guinea, Mozambique, Côte d'Ivoire). **The Markov decomposition added a new finding: between-country variance falls roughly 10-fold along the cascade** (τ² 0.96 at Start→BCG → 0.11 at Dose3→MCV1), meaning countries differ much more in EPI entry than in completion. Predicted terminal states across the continent: 14% zero-dose, 27% partial, 59% completed through MCV1.
- **Interpretation.** The DPT3→MCV1 dropoff commonly cited as a bottleneck is small. The cascade leaks fastest mid-sequence (DPT2→DPT3) and varies dramatically by country in *how* it fails. Intervention design should match the failure type: outreach and zero-dose campaigns where entry-point dominates, reminder and defaulter systems where follow-up dominates. The cascade-level heterogeneity decomposition reorients the policy question: **entry-point access is the largest source of cross-country variance and therefore the largest scope for between-country improvement.**

---

## 1. Introduction (key bullet points)

- Childhood immunization in sub-Saharan Africa: a sequential schedule of ~6 antigens delivered across the first year of life.
- Standard coverage reports (WHO/UNICEF Estimates of National Immunization Coverage; DHS final reports) treat each antigen independently and present a single "% coverage" number per vaccine.
- This obscures the **conditional structure** of the cascade. A 70% DPT3 number can arise from:
  - 30% of children never started → an access problem (entry-point failure)
  - 30% started but dropped out → a follow-up/retention problem
  - 15% in each → a combined system weakness
- The interventions are mutually distinct:
  - **Entry-point failure** ← outreach campaigns, mobile vaccination, geographical access, anti-distrust communication, zero-dose mapping (e.g., Gavi's IRMMA/ZIPS programmes)
  - **Follow-up failure** ← SMS/digital reminders, defaulter tracing, integration with other child-health visits, schedule alignment
- Prior literature has discussed DPT1-to-DPT3 dropout as a single metric (UNICEF "dropout rate"), but has not systematically decomposed the cascade into entry- vs follow-up components at continental scale.
- **Aim:** Quantify the cascade structure across all available African DHS rounds and classify countries by their dominant failure mode to inform intervention prioritization.

---

## 2. Methods (clear bullet points)

### 2.1 Data source
- **DHS Program Individual Recode (IR) hierarchical files** for every sub-Saharan African country with at least one DHS round, 1989–2024.
- Files in CSPro fixed-width format with companion data dictionaries (.DCF). Survey-level metadata extracted directly from .DCF; child-level vaccination records from record types W43 (DHS-VII onward) or 43 (DHS-VI and earlier).
- 210 surveys extracted; **163 retained** (≥30 dated dose-3 records per survey, dropping AIDS Indicator Surveys and partial rounds without vaccination modules).

### 2.2 Study population
- Children aged 12–23 months at the time of the interview, born to women aged 15–49.
- N = **263,385 children** across 163 surveys and 38 countries.

### 2.3 Vaccine receipt
- For each child: BCG, OPV0, DPT1/2/3 OR Penta1/2/3 (depending on survey wave), OPV1/2/3, PCV1/2/3 (where available), Rotavirus 1/2 (where available), and MCV1.
- **Unified DPT/Penta series.** DHS questionnaires migrated from DPT (variables H3, H5, H7) to Pentavalent (H51, H52, H53) around 2010 as Penta replaced DPT in national schedules. For each child we used whichever was recorded; the other variable is marked "Not Applicable" by DHS.
- A dose counted as "received" if the DHS status code was 1 (card date present), 2 (mother recall), or 3 (card marked, date missing). Codes 0 (no), 8 (don't know), 9 (missing), and "Not Applicable" were excluded from numerator and denominator.

### 2.4 Cascade metrics (per survey, weighted)
- **Marginal coverage** at each step: BCG, dose 1, dose 2, dose 3, MCV1.
- **Conditional dose-completion probability**: P(dose k+1 | dose k = received), where dose k+1 is the next scheduled antigen.
- **Zero-dose rate**: proportion with neither BCG NOR dose 1 (a stricter definition than WHO's "no DPT1" zero-dose; we require failure on both first scheduled antigens to be more conservative).
- **Sample weights**: DHS V005 / 1,000,000 applied throughout. Cluster (V021) and strata (V022) variables preserved for downstream variance estimation.

### 2.5 Failure-type classification
- **Entry-point failure rate** = zero-dose rate (% of children who received neither BCG nor dose 1).
- **Follow-up failure rate** = 100% − P(dose 3 | dose 1) (% of started children who did not complete DPT3/Penta3).
- Thresholds: entry-point failure ≥ 10% counted as "high"; follow-up failure ≥ 20% counted as "high". Four resulting quadrants:
  - "Both low" — functioning EPI; maintain
  - "Entry-point dominant" — access/outreach problem
  - "Follow-up dominant" — retention/reminder problem
  - "Both high" — comprehensive system weakness

### 2.6 Multistate Markov model

To complement the descriptive cascade with a formal statistical model, we represent the cascade as a discrete-state Markov chain with state space:

> *s₀ = zero-dose, s₁ = BCG only, s₂ = +Dose 1, s₃ = +Dose 2, s₄ = +Dose 3, s₅ = +MCV1 (completed)*

For each of the five transitions *q_j* = P(next state | current state), per country *c*:

1. Compute V005-weighted Bernoulli proportions p̂*_{c,j}* with Kish-effective sample size n*_eff*.
2. Fit a random-effects meta-analysis on the logit scale (DerSimonian-Laird): logit(p) ~ N(μ_j, τ_j²) with country-specific deviates u_{c,j} ~ N(0, τ_j²).
3. Compute empirical Bayes posterior means p̂_{c,j}^EB = (1−B_{c,j})·p̂_{c,j} + B_{c,j}·μ̂_j, where the shrinkage weight B_{c,j} = s²_{c,j} / (s²_{c,j} + τ̂_j²) increases with sampling uncertainty.
4. Marginalize the Markov chain to obtain predicted terminal-state probabilities per country: P(zero-dose) = 1−p̂₀^EB; P(BCG only) = p̂₀^EB·(1−p̂₁^EB); … ; P(completed) = ∏_j p̂_j^EB.
5. Heterogeneity decomposition: τ_j² and I_j² at each transition quantify how much variation across countries is explained by true between-country differences vs sampling error.

Full methods specification in [`multistate_markov/METHODS.md`](../multistate_markov/METHODS.md) (DerSimonian-Laird estimator formulas, EB shrinkage formula, state-occupation derivation).

### 2.7 Software & code
- Python 3.10 with pandas, numpy, matplotlib, scipy. No external DHS-specific package.
- Cascade-analysis scripts at `dropout_cascades/code/`:
  - `extract_child_receipt.py` — DCF parsing + DAT reading
  - `cascade_analysis.py` — weighted cascade computation + classification
  - `make_cascade_charts.py` — figures
- Multistate-Markov scripts at `dropout_cascades/multistate_markov/code/`:
  - `01_prepare_long.py` — long-format reshape (987k transition rows)
  - `02_fit_metabayesian.py` — DerSimonian-Laird + EB shrinkage
  - `03_state_occupation.py` — terminal-state probabilities
  - `04_charts.py` — multistate figures

### 2.8 Validation
- Coverage estimates from one survey (Ethiopia 2016 DHS) reproduced the published EDHS-7 final-report numbers for BCG (within 1.6 pp), DPT3 (within 0.9 pp), and MCV1 (within 0.1 pp), confirming weight application and the parser pipeline.
- Multistate transition probabilities (Bayes-shrunk) match the descriptive cascade conditional probabilities to within 0.2 pp on average — the data is rich enough that shrinkage doesn't materially move estimates, which is reassuring for the descriptive numbers.

---

## 3. Results

### 3.1 Continental cascade structure

> ![Figure 1 — Continental dropout funnel](figures/fig1_continent_dropout_funnel.png)
> **Figure 1.** Continent-average cascade across the 38 latest DHS surveys per country. Cumulative percentage at each step with inter-step losses annotated. The cascade leaks fastest at DPT2→DPT3 (−6.8 pp).

> ![Figure 2 — Waterfall cascade flow](figures/fig_a1_sankey_cascade.png)
> **Figure 2.** Continental dropout flow. Blue = children remaining on schedule. Red = children leaked at that step. Waterfall chart showing how the birth cohort is progressively depleted at each vaccine contact.

- Mean BCG coverage 88.1% — i.e. ~12% of all children never enter the EPI system at all.
- Mean dose 1: 85.9% (small step-down from BCG; 95% of BCG children come back for dose 1).
- Mean DPT/Penta 3: **74.2%** — the headline completion rate.
- Mean MCV1: 74.7% — **statistically indistinguishable from DPT3**. The widely-cited "DPT3→MCV1 dropoff" is not a continent-level phenomenon.

### 3.2 Conditional dose-completion probabilities

> ![Figure 3 — Conditional probability heatmap](figures/fig2_conditional_prob_heatmap.png)
> **Figure 3.** Country-level conditional dose-completion probabilities P(next | previous) at each transition. Greener = stickier cascade. Sorted by P(MCV1 | DPT3).

- Mean P(dose 1 | BCG) = 95.0% (strong link)
- Mean P(dose 2 | dose 1) = 93.5%
- Mean P(dose 3 | dose 2) = **90.3%** (the largest mid-cascade leak)
- Mean P(MCV1 | dose 3) = 88.3%
- Each transition loses ~5–10% of the prior cohort. The losses **compound multiplicatively** to produce the BCG-to-MCV1 attrition.

### 3.3 Country classification

> ![Figure 4 — Failure-type quadrant scatter](figures/fig3_entry_vs_followup_quadrant.png)
> **Figure 4.** Each country (latest DHS) plotted by entry-point failure (x) and follow-up failure (y). Four-quadrant policy classification with thresholds at 10% / 20%.

> ![Figure 5 — Burden-weighted bubble chart](figures/fig_a3_bubble_burden.png)
> **Figure 5.** Same axes as Figure 4, but bubble size proportional to absolute number of zero-dose children per year (UN under-1 population × entry-point failure %). Identifies countries with the largest absolute zero-dose populations — the priority for intervention scale.

- **21 countries: "Both low" (maintain).** Burkina Faso, Burundi, Eswatini, Gabon, Gambia, Ghana, Kenya, Lesotho, Malawi, Mauritania, Namibia, Rwanda, Senegal, Sierra Leone, Sudan, São Tomé & P., Tanzania, Togo, Uganda, Zambia, Zimbabwe.
- **6 countries: "Entry-point dominant" (access/outreach).** Benin, Cameroon, Comoros, Madagascar, Mali, **Nigeria**. Nigeria's 54% zero-dose rate dominates the continent's absolute zero-dose burden.
- **4 countries: "Follow-up dominant" (retention/reminders).** Congo (Brazzaville), Liberia, Niger, **South Africa**. South Africa is the most surprising — high health-system capacity but a measurable mid-cascade dropout pointing at scheduling and reminder gaps.
- **7 countries: "Both high" (rebuild).** Angola, Chad, Côte d'Ivoire, DR Congo, Ethiopia, Guinea, Mozambique. These account for a disproportionate share of unprotected children continent-wide.

### 3.4 Regional patterns

> ![Figure 6 — Regional cascade comparison](figures/fig_a2_regional_bars.png)
> **Figure 6.** Cascade by region (latest survey per country, mean ± 1 SD). East and Southern Africa show flatter cascades and lower variance; West and Central Africa show steeper cascades and higher between-country variance.

- East Africa (Burundi, Ethiopia, Kenya, Madagascar, Rwanda, Tanzania, Uganda, Comoros): mean DPT3 ~82%.
- Southern Africa (Eswatini, Lesotho, Malawi, Mozambique, Namibia, South Africa, Zambia, Zimbabwe): mean DPT3 ~82%.
- West Africa (Benin, Burkina Faso, Côte d'Ivoire, Gambia, Ghana, Guinea, Liberia, Mali, Mauritania, Niger, Nigeria, Senegal, Sierra Leone, Togo): high between-country variance — Burkina Faso 89% next to Nigeria 38%.
- Central Africa (Angola, Cameroon, Chad, Congo, DR Congo, Gabon, São Tomé, Sudan): mean DPT3 ~63% — the lowest of the four regions.

### 3.5 Country-level cascades

> ![Figure 7 — Country small-multiples cascade](figures/fig4_country_small_multiples.png)
> **Figure 7.** All 38 countries' cascades side by side (latest DHS). Provides an at-a-glance view of who has flat (functioning) vs steeply declining (broken) cascades.

> ![Figure 8 — Status decomposition by country](figures/fig_a5_status_decomposition.png)
> **Figure 8.** For each country, the 12–23 month child population decomposed into four mutually exclusive categories: fully completed (MCV1 received), DPT3 complete but no MCV1, started but no DPT3, and zero-dose. Stacked to 100%.

- Visualizes the same data as Figure 4 but in absolute proportions rather than failure ratios.
- Useful for communicating the "what proportion of children are each kind of unprotected" framing to policy audiences.

### 3.6 Change over time

> ![Figure 9 — Cascade evolution over time (selected countries)](figures/fig5_cascade_over_time.png)
> **Figure 9.** Cascade evolution for the 8 countries with the most DHS rounds. Reveals whether countries are improving (Senegal, Ghana), stagnating, or backsliding.

> ![Figure 10 — Long-run change in DPT3 coverage](figures/fig_a4_change_over_time.png)
> **Figure 10.** For each country with ≥3 DHS rounds, percentage-point change in DPT3 coverage between earliest and latest DHS in panel. Ranked. Identifies improvers vs decliners.

- Several countries show large multi-decade gains in DPT3 coverage (Burkina Faso, Rwanda, Sierra Leone, Tanzania).
- A handful show stagnation or modest decline despite global trends (Nigeria, where coverage has fluctuated around the lower end).
- Time-trend separation by failure type (not shown): the entry-point-dominant countries have made less progress than the follow-up-dominant ones over the panel period.

### 3.7 Formal multistate Markov decomposition

The descriptive cascade analysis (§ 3.1–3.6) is informative but unprincipled in two ways: (i) it computes raw conditional probabilities per country with no statistical pooling across surveys, so countries with small dated-record counts carry the same weight as well-measured ones; and (ii) it doesn't formalize the cascade as a probabilistic process whose end-state can be predicted. The multistate Markov model addresses both.

#### 3.7.1 Continent-level transition probabilities (Bayes-shrunk)

> ![Figure 11 — Continent-level Markov diagram](figures/ms_fig5_markov_diagram.png)
> **Figure 11.** Five-state Markov chain with Bayes-shrunk continent-mean transition probabilities (blue arrows) and dropout per step (red arrows). The chain leaks gradually rather than at a single break point. Transition probabilities are: Start→BCG 90.1%, BCG→Dose 1 95.5%, Dose 1→Dose 2 93.0%, Dose 2→Dose 3 89.2%, Dose 3→MCV1 88.5%.

The shrunk continent-mean transitions confirm and refine the descriptive cascade numbers. The smallest conditional probability is Dose 3→MCV1 (88.5%), narrowly below Dose 2→Dose 3 (89.2%). Note that in the descriptive marginal cascade (§3.1), DPT2→DPT3 shows the largest absolute step-down (−6.8 pp) because it operates on a larger entering cohort; the Markov transition probability is a conditional measure and the two metrics are complementary.

#### 3.7.2 Country-specific transitions and shrinkage

> ![Figure 12 — Per-country forest plot, raw vs shrunk](figures/ms_fig1_forest_raw_vs_shrunk.png)
> **Figure 12.** Per-country transition probabilities at each of the five Markov transitions. Blue dots = raw country estimates; blue dots with 95% CIs = Bayes-shrunk posterior means. Red dashed line = continent posterior mean. Sorted by shrunk estimate within each panel.

> ![Figure 13 — Per-country transition heatmap](figures/ms_fig4_transition_heatmap.png)
> **Figure 13.** Heatmap of Bayes-shrunk transition probabilities. Rows = countries (sorted by Dose 3→MCV1); columns = five transitions; green = high completion. The diagonal pattern shows countries that perform well on entry also tend to perform well on completion — a positive correlation we exploit as a sensitivity discussion below.

Shrinkage is uniformly small (< 0.2 percentage points on average across transitions) because country samples are large enough that the raw estimates already dominate the prior. This is reassuring for the descriptive analysis in § 3.1–3.6: the unweighted cross-country averages we reported are very close to what the formal model produces.

#### 3.7.3 Heterogeneity decomposition — a new finding

> ![Figure 14 — Between-country heterogeneity by transition](figures/ms_fig2_heterogeneity_decreases.png)
> **Figure 14.** Between-country variance τ² (logit scale) for each Markov transition, with the corresponding I² statistic annotated. Variance falls roughly **10-fold from Start→BCG (τ² = 0.96) to Dose 3→MCV1 (τ² = 0.11)**.

The cascade-level decomposition of between-country variance is the multistate model's distinctive contribution. Three observations:

- τ² is highest at the entry point and falls monotonically through the cascade.
- All five transitions have I² > 97 %, meaning between-country variation overwhelmingly dominates within-country sampling error.
- The implication: **countries differ much more in EPI entry than in completion.** Once a child reaches BCG, the conditional probability of moving to the next dose is fairly similar across countries; getting to BCG in the first place varies wildly.

This refines the Research 2 policy framing introduced in § 3.3. The entry-point lever (zero-dose mapping, outreach, communication) addresses the **largest source of cross-country variance** and therefore has the largest scope for between-country improvement. The completion lever (reminder systems, defaulter tracing) addresses a smaller variance — a more uniform problem across countries.

#### 3.7.4 Predicted terminal-state occupation

> ![Figure 15 — Predicted terminal states per country](figures/ms_fig3_state_occupation_stack.png)
> **Figure 15.** Predicted percentage of children 12–23 months in each terminal state (zero-dose / BCG only / Dose 1 max / Dose 2 max / Dose 3 max / MCV1 completed), computed by marginalizing the Bayes-shrunk Markov chain country by country. Countries sorted by completion rate.

Continent-level prediction (mean across countries):

| Terminal state | Predicted % |
|---|---:|
| Zero-dose | 13.7 % |
| BCG only | 5.4 % |
| Dose 1 max | 6.2 % |
| Dose 2 max | 8.2 % |
| Dose 3 max | 7.5 % |
| **Completed (MCV1)** | **59.0 %** |

So roughly **3 in 5 sub-Saharan African children complete the full schedule** through MCV1; the remaining 41 % are distributed across partial states. Zero-dose (13.7 %) is the largest single unprotected category and concentrates the policy-relevant variance identified in § 3.7.3.

---

## 4. Discussion (key bullet points)

### 4.1 Main findings recapped
- The EPI cascade in sub-Saharan Africa **leaks gradually, not at a single break point.** Each transition loses 5–10% of the prior cohort.
- The largest single mid-cascade leak is DPT2→DPT3 (−6.8 pp on average).
- DPT3 and MCV1 sit at essentially the same coverage level (~74%); the widely-cited "measles outreach" gap is not where the cascade breaks at continental scale.
- Country heterogeneity is enormous and patterned: countries cluster into four meaningfully distinct policy regimes, not a single performance gradient.
- The multistate Markov decomposition (§ 3.7) reveals that **between-country variance falls ~10-fold along the cascade** — countries differ much more in EPI entry (τ² = 0.96) than in completion (τ² = 0.11). The variance-rich step is therefore the entry point, sharpening where between-country improvement has the largest scope.
- Predicted terminal-state distribution: **59% complete the schedule, 14% are zero-dose, 27% partial.**

### 4.2 Policy implications by quadrant
- **Both-low countries (n=21):** focus on the final 10% — typically marginalized urban and conflict-affected populations. Standard EPI strengthening continues to work.
- **Entry-point-dominant countries (n=6, incl. Nigeria):** the dominant lever is **reaching unvaccinated children**. Investment in geographically targeted outreach, integration with community health worker networks, and zero-dose mapping (Gavi IRMMA, Reaching Every District). SMS reminders are not the right primary intervention here — there's no number to send the SMS to because the child has no contact with the system.
- **Follow-up-dominant countries (n=4, incl. South Africa):** the dominant lever is **completion**. Default tracing, reminder systems (SMS or community health worker visits), reducing missed-opportunity rates at the second and third scheduled visits.
- **Both-high countries (n=7):** require integrated rebuilds; single-lever interventions will under-perform.

### 4.3 Why the DPT2→DPT3 leak matters more than the DPT3→MCV1 gap
- Children "due" for MCV1 at 9 months have already had three prior scheduled visits. The cohort that arrives at the 9-month visit has been pre-selected by the DPT cascade.
- Improvements upstream (keeping DPT1, 2, 3 intervals tight) propagate downstream more efficiently than additional outreach at 9 months.
- This implies a sequencing recommendation: **strengthen the 10-week→14-week interval delivery first**, then MCV1 outreach.

### 4.4 Comparison with prior estimates
- Our DPT3 estimates align closely with published DHS and WHO/UNICEF Estimates of National Immunization Coverage (WUENIC) figures for overlapping country-years.
- The novel contribution is not the marginal numbers but the cascade structure and quadrant classification.
- Our zero-dose definition (no BCG AND no DPT1) is stricter than WUENIC's "no DPT1"; this produces lower zero-dose rates than WUENIC but reduces false positives from data-collection error on any single antigen.

### 4.5 Limitations
- **Card vs recall doses pooled.** We do not separate card-confirmed from maternal-recall doses; recall bias may inflate coverage estimates by 5–10 pp on average. Robustness check: restricting to card-confirmed only (status = 1) does not change the classification of any country between quadrants.
- **Age cohort.** 12–23 months. Older children may have received doses subsequently but are not captured.
- **EPI schedules vary.** WHO-standard windows used here. Some countries shift MCV1 to 12 months in national schedules; this slightly changes MCV1 "completion" for those countries.
- **Sub-national variation hidden.** National panels mask large within-country geographic inequities. The underlying child-level data preserves cluster and region variables for follow-up analysis.
- **Latest survey for some countries is dated** (Niger 2012, Togo 2013, Eswatini 2006, São Tomé 2008). Treat their classifications as conditional on the latest available data, not as current-state.

### 4.6 Future work
- Sub-national (region/cluster-level) replication using the same pipeline.
- Linkage with sub-national conflict, urbanicity, and wealth data to model determinants of each failure type.
- Card-confirmed-only sensitivity analysis at full panel scale.
- Modeling impact of switching from DPT-era to Penta-era schedules on cascade completion (initial evidence in the panel suggests modest improvement post-Penta).

---

## 5. Funding & ethics
- No external funding.
- Secondary analysis of de-identified public-use DHS data; no new human subjects research; DHS Program data-access agreement complied with.

## 6. Data availability
- DHS individual recode files are publicly available from the DHS Program (https://dhsprogram.com/) under registration.
- All code is provided as supplementary material; all derived CSVs accompany this manuscript.

## 7. Author contributions
- [TBD]

## 8. Acknowledgements
- The DHS Program for the underlying surveys and the participating Ministries of Health.

---

## Figure list (in manuscript order)

| # | Filename | Purpose |
|---|---|---|
| 1 | `fig1_continent_dropout_funnel.png` | Continental cascade with step-level losses |
| 2 | `fig_a1_sankey_cascade.png` | Sankey-style flow showing cumulative cohort attrition |
| 3 | `fig2_conditional_prob_heatmap.png` | Country × transition conditional probabilities |
| 4 | `fig3_entry_vs_followup_quadrant.png` | Classification scatter |
| 5 | `fig_a3_bubble_burden.png` | Burden-weighted bubble chart |
| 6 | `fig_a2_regional_bars.png` | Regional comparison |
| 7 | `fig4_country_small_multiples.png` | All-countries small multiples |
| 8 | `fig_a5_status_decomposition.png` | Status decomposition stack |
| 9 | `fig5_cascade_over_time.png` | Selected-country trajectories |
| 10 | `fig_a4_change_over_time.png` | Long-run DPT3 change |
| 11 | `ms_fig5_markov_diagram.png` | Continent-level Markov chain with shrunk transition probabilities |
| 12 | `ms_fig1_forest_raw_vs_shrunk.png` | Per-country forest: raw vs Bayes-shrunk transition probabilities |
| 13 | `ms_fig4_transition_heatmap.png` | Per-country shrunk transition heatmap |
| 14 | `ms_fig2_heterogeneity_decreases.png` | Between-country variance τ² along the cascade — new finding |
| 15 | `ms_fig3_state_occupation_stack.png` | Predicted terminal-state probabilities per country |

## Supplementary tables

| Filename | Content |
|---|---|
| `dropout_cascade_panel.csv` | 163-row panel: every survey × all cascade percentages and conditional probabilities |
| `country_classification.csv` | 38 rows: latest survey per country with failure_type label |
| `latest_survey_cascade.csv` | Same survey data, cleaner column set |
| `country_status_decomposition.csv` | Fully/partial/zero-dose decomposition per country |
| `multistate_markov/country_transition_shrunk.csv` | Bayes-shrunk Markov transition probabilities with 95% CIs |
| `multistate_markov/meta_summary.csv` | Per-transition meta-analysis statistics (τ², I², Q) |
| `multistate_markov/state_occupation_shrunk.csv` | Predicted terminal-state probabilities per country |
