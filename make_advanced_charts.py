"""Advanced visualizations for Research 2 manuscript:
   1. Sankey-style cascade flow (continent average)
   2. Regional comparison bars (East/West/Central/Southern Africa)
   3. Population-weighted bubble chart (zero-dose burden in absolute terms)
   4. Change-over-time scatter for repeat-survey countries
   5. Decomposition stack: every child as one of {fully vaccinated, partially, zero-dose}
"""
import numpy as np, pandas as pd
from pathlib import Path
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.path import Path as MplPath
from matplotlib.patches import PathPatch

BASE = Path("/sessions/kind-sharp-shannon/mnt/outputs/dropout")
DEST = Path("/sessions/kind-sharp-shannon/mnt/DHS folder/dropout_cascades/manuscript/figures")
DEST.mkdir(parents=True, exist_ok=True)

casc = pd.read_csv(BASE/"cascade_panel.csv")
latest = pd.read_csv(BASE/"country_classification.csv")

# Country -> region
REGIONS = {
    "East": ["Ethiopia","Kenya","Uganda","Tanzania","Rwanda","Burundi","Madagascar","Comoros","South Sudan"],
    "Southern": ["Zambia","Zimbabwe","Malawi","Mozambique","South Africa","Lesotho","Eswatini","Namibia"],
    "West": ["Burkina Faso","Mali","Senegal","Ghana","Côte d'Ivoire","Nigeria","Niger","Benin","Togo",
             "Sierra Leone","Liberia","Gambia","Guinea","Mauritania","Cape Verde"],
    "Central": ["DR Congo","Cameroon","Chad","Congo (Brazz.)","Gabon","Angola","Sudan",
                "São Tomé & P.","Central African Republic"],
}
def region_of(c):
    for r, lst in REGIONS.items():
        if c in lst: return r
    return "Other"

latest["region"] = latest["country"].apply(region_of)
casc["region"] = casc["country"].apply(region_of)

# UN estimates of under-1 population (annual, ~2022) for population-weighted bubble chart.
# Source: UN Population Division WPP 2022 medium variant, rounded to nearest 1000.
# These are illustrative for the bubble chart only.
UNDER1_POP = {
    "Nigeria": 7900_000, "DR Congo": 3700_000, "Ethiopia": 3500_000, "Tanzania": 2200_000,
    "Uganda": 1800_000, "Kenya": 1500_000, "Angola": 1300_000, "Mozambique": 1200_000,
    "Cameroon": 950_000, "Ghana": 900_000, "Madagascar": 880_000, "Niger": 1100_000,
    "Côte d'Ivoire": 850_000, "Burkina Faso": 780_000, "Mali": 760_000,
    "Malawi": 660_000, "Zambia": 660_000, "Chad": 690_000, "Senegal": 540_000,
    "Sierra Leone": 230_000, "Rwanda": 350_000, "Burundi": 470_000, "South Africa": 1100_000,
    "Benin": 410_000, "Guinea": 470_000, "Togo": 280_000, "Liberia": 170_000,
    "Eritrea": 110_000, "Sudan": 1400_000, "Zimbabwe": 460_000, "Mauritania": 160_000,
    "Lesotho": 60_000, "Eswatini": 35_000, "Namibia": 75_000, "Gabon": 65_000,
    "Gambia": 95_000, "Comoros": 25_000, "São Tomé & P.": 7_000,
    "Congo (Brazz.)": 200_000,
}

COLORS = {
    "BCG":"#2c7fb8","dose1":"#41ab5d","dose2":"#feb24c","dose3":"#fc4e2a","MCV1":"#bd0026",
    "zero":"#666","drop":"#bbb",
}

# =====================================================================
# ADV-FIG 1 — Sankey-style cascade flow (continent average)
# =====================================================================
# Mean values across latest survey per country
mean_vals = {
    "BCG": latest["BCG_pct"].mean(),
    "dose1": latest["dose1_pct"].mean(),
    "dose2": latest["dose2_pct"].mean(),
    "dose3": latest["dose3_pct"].mean(),
    "MCV1": latest["MCV1_pct"].mean(),
}
# Zero-dose (start of cascade) — kids who never even got BCG
zero_dose_start = 100 - mean_vals["BCG"]

fig, ax = plt.subplots(figsize=(14, 7))
node_x = [0, 1.6, 3.2, 4.8, 6.4, 8.0]
node_w = 0.18
NODE_LABEL = ["Birth\n(starting cohort)","BCG","DPT/Penta 1\n(6 wk)","DPT/Penta 2\n(10 wk)",
              "DPT/Penta 3\n(14 wk)","MCV1\n(9 mo)"]
# Each node: total height = 100 (proportional to children)
vals = [100, mean_vals["BCG"], mean_vals["dose1"], mean_vals["dose2"], mean_vals["dose3"], mean_vals["MCV1"]]

# Draw blue nodes (kids still on schedule)
for i, (x, v, lab) in enumerate(zip(node_x, vals, NODE_LABEL)):
    # received bar
    ax.fill_between([x-node_w, x+node_w], 0, v, color="#2c7fb8", alpha=0.85)
    # dropped-out bar (kids no longer in the cascade)
    ax.fill_between([x-node_w, x+node_w], v, 100, color="#e34a33", alpha=0.35)
    # Number label
    ax.text(x, v + 1.5, f"{v:.1f}%", ha="center", va="bottom", fontsize=11, fontweight="bold", color="#1a5089")
    ax.text(x, -8, lab, ha="center", va="top", fontsize=10, fontweight="bold")
    # Cumulative-dropout annotation
    if i > 0:
        drop = vals[i-1] - vals[i]
        if drop > 0.1:
            ax.text(x, v - 4, f"−{drop:.1f}pp\nleak", ha="center", va="top", fontsize=8, color="#a02020")

# Draw flowing ribbons between adjacent nodes — the "received" band
for i in range(len(node_x)-1):
    x0, x1 = node_x[i]+node_w, node_x[i+1]-node_w
    v0, v1 = vals[i], vals[i+1]
    # Bezier ribbon (top of received goes from v0 to v1)
    xs = np.linspace(x0, x1, 50)
    # smooth interpolation
    t = (xs-x0)/(x1-x0)
    smooth = 0.5 - 0.5*np.cos(np.pi*t)
    ys_top = v0 + (v1-v0)*smooth
    ax.fill_between(xs, 0, ys_top, color="#2c7fb8", alpha=0.45)
    # Lost band (between v1 and v0)
    if v0 > v1:
        ax.fill_between(xs, ys_top, v0, color="#e34a33", alpha=0.3)
ax.set_xlim(-0.6, 8.6); ax.set_ylim(-15, 110)
ax.set_xticks([]); ax.set_yticks([])
ax.set_title("EPI dropout cascade — continent average (latest DHS per country, n=38)\nBlue = still on schedule. Red = leaked out at that step.",
             fontsize=13, pad=15)
ax.spines[:].set_visible(False)
# Legend

ax.legend(handles=[mpatches.Patch(color="#2c7fb8", label="Children remaining on schedule"),
                   mpatches.Patch(color="#e34a33", alpha=0.5, label="Children who dropped out at/before this step")],
          loc="upper right", fontsize=10)
fig.tight_layout()
fig.savefig(DEST/"fig_a1_sankey_cascade.png", dpi=180, bbox_inches="tight")
plt.close()

# =====================================================================
# ADV-FIG 2 — Regional comparison (East/West/Central/Southern)
# =====================================================================
fig, axes = plt.subplots(1, 4, figsize=(15, 5), sharey=True)
STEPS = ["BCG_pct","dose1_pct","dose2_pct","dose3_pct","MCV1_pct"]
STEP_LABELS = ["BCG","D1","D2","D3","MCV1"]
COL = ["#2c7fb8","#41ab5d","#feb24c","#fc4e2a","#bd0026"]
for ax, region in zip(axes, ["West","East","Central","Southern"]):
    sub = latest[latest["region"]==region]
    n = len(sub)
    if n == 0:
        ax.set_visible(False); continue
    means = [sub[c].mean() for c in STEPS]
    stds  = [sub[c].std() for c in STEPS]
    x = np.arange(5)
    bars = ax.bar(x, means, color=COL, alpha=0.85)
    # Error bars: 1 SD
    ax.errorbar(x, means, yerr=stds, fmt="none", color="#333", capsize=4, capthick=1.2, alpha=0.7)
    for i, (m, b) in enumerate(zip(means, bars)):
        ax.text(b.get_x()+b.get_width()/2, m+1, f"{m:.0f}%", ha="center", fontsize=9, fontweight="bold")
    ax.set_xticks(x); ax.set_xticklabels(STEP_LABELS, fontsize=10)
    ax.set_title(f"{region} Africa\n({n} countries)", fontsize=11)
    ax.set_ylim(0,105); ax.grid(axis="y", alpha=0.3)
    countries = ", ".join(sub["country"].tolist())
    ax.text(0.5, -0.22, countries, transform=ax.transAxes, fontsize=7, ha="center", va="top",
            color="#666", wrap=True)
axes[0].set_ylabel("% receiving (mean across countries ± 1 SD)")
fig.suptitle("Regional cascade comparison — latest DHS per country", fontsize=13, y=1.02)
fig.tight_layout()
fig.savefig(DEST/"fig_a2_regional_bars.png", dpi=180, bbox_inches="tight")
plt.close()

# =====================================================================
# ADV-FIG 3 — Population-weighted bubble chart
#   x = entry-point failure %, y = follow-up failure %
#   bubble size = absolute # of zero-dose children per year
# =====================================================================
fig, ax = plt.subplots(figsize=(13, 9))
latest["under1_pop"] = latest["country"].map(UNDER1_POP)
latest["zero_dose_abs"] = (latest["under1_pop"] * latest["entry_point_failure"]/100).fillna(0)

# Color by quadrant
def quad_color(row):
    e, f = row["entry_point_failure"], row["follow_up_failure"]
    if pd.isna(e) or pd.isna(f): return "#888"
    if e >= 10 and f >= 20: return "#bd0026"   # both high
    if e >= 10: return "#fc4e2a"               # entry-dominant
    if f >= 20: return "#feb24c"               # follow-up dominant
    return "#41ab5d"                            # both low
latest["color"] = latest.apply(quad_color, axis=1)

# Bubble size: proportional to absolute zero-dose pop (clip extremes)
sizes = np.clip(np.sqrt(latest["zero_dose_abs"].fillna(1))/3, 30, 800)
ax.scatter(latest["entry_point_failure"], latest["follow_up_failure"],
           s=sizes, c=latest["color"], alpha=0.65, edgecolors="white", linewidth=1.5)

# Label all countries; emphasize big bubbles
big_ones = latest.nlargest(8, "zero_dose_abs")
big_set = set(big_ones["country"])
for _, r in latest.iterrows():
    if pd.isna(r["entry_point_failure"]) or pd.isna(r["follow_up_failure"]): continue
    weight = "bold" if r["country"] in big_set else "normal"
    fontsize = 10 if r["country"] in big_set else 8
    ax.annotate(r["country"], (r["entry_point_failure"], r["follow_up_failure"]),
                fontsize=fontsize, xytext=(5,4), textcoords="offset points",
                fontweight=weight)
ax.axhline(20, color="gray", ls=":", alpha=0.5)
ax.axvline(10, color="gray", ls=":", alpha=0.5)
ax.set_xlabel("Entry-point failure — % of children receiving NO doses", fontsize=11)
ax.set_ylabel("Follow-up failure — % of started children who didn't complete DPT3", fontsize=11)
ax.set_title("Where the EPI cascade fails — bubble size = absolute number of zero-dose children per year\n"
             "Larger bubbles = larger absolute burden, prioritize for intervention",
             fontsize=12, pad=15)
ax.set_xlim(-2, max(38, latest["entry_point_failure"].max()+3))
ax.set_ylim(-2, max(50, latest["follow_up_failure"].max()+3))
ax.grid(alpha=0.3)

# Quadrant text
ax.text(2,  3,  "MAINTAIN\n(both low)", fontsize=11, color="#258a3e", fontweight="bold", alpha=0.6, va="center")
ax.text(2,  45, "FOLLOW-UP\nDOMINANT", fontsize=11, color="#cc7700", fontweight="bold", alpha=0.6)
ax.text(28, 3,  "ENTRY-POINT\nDOMINANT", fontsize=11, color="#bf3812", fontweight="bold", alpha=0.6)
ax.text(28, 45, "REBUILD\n(both high)", fontsize=11, color="#7a0a18", fontweight="bold", alpha=0.6)

# Legend for bubble sizes
sample_pops = [50_000, 250_000, 1_000_000, 3_000_000]
sample_sizes = [np.clip(np.sqrt(p)/3, 30, 800) for p in sample_pops]
legend_x = 33; legend_y = 38
ax.text(legend_x, legend_y+5, "Zero-dose children/yr:", fontsize=9, fontweight="bold")
for i, (p, s) in enumerate(zip(sample_pops, sample_sizes)):
    ax.scatter(legend_x+1, legend_y-i*3, s=s, c="#888", alpha=0.5, edgecolor="white")
    label = f"{p//1000}K" if p < 1_000_000 else f"{p//1_000_000}M"
    ax.text(legend_x+3, legend_y-i*3, label, fontsize=9, va="center")

fig.tight_layout()
fig.savefig(DEST/"fig_a3_bubble_burden.png", dpi=180, bbox_inches="tight")
plt.close()

# =====================================================================
# ADV-FIG 4 — Change over time: countries with ≥3 rounds, latest vs earliest
# =====================================================================
counts = casc.groupby("country").size()
multi = counts[counts >= 3].index.tolist()
delta_rows = []
for c in multi:
    sub = casc[casc["country"]==c].sort_values("year")
    if len(sub) < 2: continue
    first = sub.iloc[0]; last = sub.iloc[-1]
    delta_rows.append({
        "country": c,
        "yr_first": int(first["year"]), "yr_last": int(last["year"]),
        "delta_dose3": last["dose3_pct"] - first["dose3_pct"],
        "delta_zd": last["zero_dose_pct"] - first["zero_dose_pct"],
        "delta_mcv": last["MCV1_pct"] - first["MCV1_pct"],
        "first_dose3": first["dose3_pct"], "last_dose3": last["dose3_pct"],
    })
ddf = pd.DataFrame(delta_rows).sort_values("delta_dose3")

fig, ax = plt.subplots(figsize=(10, max(6, len(ddf)*0.32)))
y = np.arange(len(ddf))
colors = ["#bd0026" if d < -5 else "#fc4e2a" if d < 0 else "#41ab5d" if d > 10 else "#a6d96a" for d in ddf["delta_dose3"]]
ax.barh(y, ddf["delta_dose3"], color=colors, alpha=0.85)
for i, r in enumerate(ddf.itertuples()):
    span = f"{r.yr_first}→{r.yr_last}"
    ax.text(r.delta_dose3 + (0.5 if r.delta_dose3>=0 else -0.5), i,
            f"{r.delta_dose3:+.1f}pp  ({span})", va="center",
            ha="left" if r.delta_dose3>=0 else "right", fontsize=8)
ax.set_yticks(y); ax.set_yticklabels(ddf["country"], fontsize=9)
ax.axvline(0, color="black", linewidth=0.5)
ax.set_xlabel("Change in DPT3/Penta3 coverage (percentage points)")
ax.set_title("Long-run change in DPT3 coverage — earliest to latest DHS in panel\n(countries with ≥3 survey rounds)",
             fontsize=12, pad=12)
ax.grid(axis="x", alpha=0.3)
ax.set_xlim(min(ddf["delta_dose3"].min()-5, -10), max(ddf["delta_dose3"].max()+15, 25))
fig.tight_layout()
fig.savefig(DEST/"fig_a4_change_over_time.png", dpi=180, bbox_inches="tight")
plt.close()

# =====================================================================
# ADV-FIG 5 — Decomposition: every child in latest survey broken into categories
# =====================================================================
# Categories: fully (got MCV1), partial-DPT-complete (got dose3 but not MCV1),
#             partial-incomplete (got SOMETHING but not dose3), zero-dose
# Approximate from cascade values:
latest["pct_fully"] = latest["MCV1_pct"]
latest["pct_partial_d3"] = latest["dose3_pct"] - latest["MCV1_pct"]
latest["pct_partial_d3"] = latest["pct_partial_d3"].clip(lower=0)
latest["pct_partial_started"] = latest["BCG_pct"] - latest["dose3_pct"]
latest["pct_partial_started"] = latest["pct_partial_started"].clip(lower=0)
latest["pct_zero_dose"] = 100 - latest["BCG_pct"]
latest["pct_zero_dose"] = latest["pct_zero_dose"].clip(lower=0)

# Sort by % zero-dose for sequencing
dec = latest.sort_values("pct_zero_dose")
fig, ax = plt.subplots(figsize=(11, max(7, len(dec)*0.3)))
y = np.arange(len(dec))
ax.barh(y, dec["pct_fully"], color="#41ab5d", label="Fully completed (MCV1 received)")
ax.barh(y, dec["pct_partial_d3"], left=dec["pct_fully"], color="#a6d96a", label="DPT3 but no MCV1")
ax.barh(y, dec["pct_partial_started"], left=dec["pct_fully"]+dec["pct_partial_d3"], color="#feb24c", label="Started but no DPT3")
ax.barh(y, dec["pct_zero_dose"], left=dec["pct_fully"]+dec["pct_partial_d3"]+dec["pct_partial_started"],
        color="#bd0026", label="Zero-dose (no BCG, no DPT1)")
ax.set_yticks(y); ax.set_yticklabels(dec["country"], fontsize=8)
ax.set_xlabel("% of children (latest DHS)")
ax.set_xlim(0,100)
ax.legend(loc="lower right", fontsize=9)
ax.set_title("Vaccination status breakdown — every child 12–23 months in the latest DHS, by country",
             fontsize=12, pad=12)
fig.tight_layout()
fig.savefig(DEST/"fig_a5_status_decomposition.png", dpi=180, bbox_inches="tight")
plt.close()

# Save the underlying decomposition CSV
dec[["country","year","pct_fully","pct_partial_d3","pct_partial_started","pct_zero_dose"]].to_csv(
    DEST.parent/"country_status_decomposition.csv", index=False)
print(f"Wrote 5 advanced figures to {DEST}")
for f in sorted(DEST.glob("*.png")):
    print(f"  {f.name}  ({f.stat().st_size//1024} KB)")
