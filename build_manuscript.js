const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
  Header, Footer, AlignmentType, LevelFormat, BorderStyle, WidthType, ShadingType,
  HeadingLevel, PageBreak, PageNumber, PageOrientation, TabStopType, TabStopPosition,
} = require('docx');

const FIG_DIR = "/sessions/kind-sharp-shannon/mnt/DHS folder/dropout_cascades/manuscript/figures";
const OUT = "/sessions/kind-sharp-shannon/mnt/DHS folder/dropout_cascades/manuscript/Research2_manuscript_outline.docx";

// Helper: paragraph with default body styling
const P = (text, opts={}) => new Paragraph({
  spacing: { after: 120 },
  children: [new TextRun({ text, ...opts })],
});

// Heading paragraph
const H1 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 360, after: 180 },
  children: [new TextRun({ text, bold: true, size: 32 })],
});
const H2 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 240, after: 120 },
  children: [new TextRun({ text, bold: true, size: 26 })],
});
const H3 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_3,
  spacing: { before: 180, after: 100 },
  children: [new TextRun({ text, bold: true, italics: false, size: 22 })],
});

// Bullet paragraph (uses "bullets" numbering reference)
const B = (text, level=0) => new Paragraph({
  numbering: { reference: "bullets", level },
  spacing: { after: 60 },
  children: typeof text === "string" ? [new TextRun(text)] : text,
});

// Bold-then-rest bullet
const Bb = (bold, rest) => new Paragraph({
  numbering: { reference: "bullets", level: 0 },
  spacing: { after: 60 },
  children: [
    new TextRun({ text: bold, bold: true }),
    new TextRun({ text: rest }),
  ],
});

// Image w/ caption
const FIG = (filename, captionBold, captionRest, w=520) => {
  const fpath = path.join(FIG_DIR, filename);
  const buf = fs.readFileSync(fpath);
  // proportional sizing — approx 4:3 ratio fallback
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 180, after: 60 },
      children: [new ImageRun({
        type: "png",
        data: buf,
        transformation: { width: w, height: Math.round(w * 0.62) },
        altText: { title: captionBold, description: captionRest, name: filename },
      })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
      children: [
        new TextRun({ text: captionBold, bold: true, size: 20 }),
        new TextRun({ text: " " + captionRest, size: 20 }),
      ],
    }),
  ];
};

// Simple two-column table for figure list
const TABLE_BORDER = { style: BorderStyle.SINGLE, size: 1, color: "AAAAAA" };
const tBorders = { top: TABLE_BORDER, bottom: TABLE_BORDER, left: TABLE_BORDER, right: TABLE_BORDER };
function tableRow(cells, header=false) {
  return new TableRow({
    tableHeader: header,
    children: cells.map((c, i) => new TableCell({
      borders: tBorders,
      width: { size: c.w || 3120, type: WidthType.DXA },
      shading: header ? { fill: "E6EEF7", type: ShadingType.CLEAR } : undefined,
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({
        children: [new TextRun({ text: c.text, bold: header, size: 18 })],
      })],
    })),
  });
}

// Build the body content
const body = [];

// Title block
body.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 120 },
  children: [new TextRun({
    text: "Where the EPI cascade breaks:",
    bold: true, size: 36, color: "1a3b6e",
  })],
}));
body.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 200 },
  children: [new TextRun({
    text: "separating entry-point from follow-up failure across 38 sub-Saharan African countries",
    bold: true, size: 28, italics: true, color: "1a3b6e",
  })],
}));
body.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 80 },
  children: [new TextRun({ text: "Research 2 — Manuscript Outline (Draft)", italics: true, size: 22, color: "555555" })],
}));
body.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 360 },
  children: [new TextRun({ text: "Author list: [TBD] · Target journals: Lancet Global Health, BMJ Global Health, Vaccine, Bulletin of the WHO",
    size: 18, color: "555555" })],
}));

// ABSTRACT
body.push(H1("Abstract"));
body.push(P("Placeholder, ~250 words. The key claims:"));
body.push(Bb("Background. ", "Standard coverage statistics treat each antigen independently, masking whether unvaccinated children were never reached or started but did not complete the schedule. The two failures require different policy responses."));
body.push(Bb("Methods. ", "163 DHS surveys from 38 sub-Saharan African countries (1989–2024, n=263,385 children aged 12–23 months). Cascades from BCG through MCV1; conditional dose-completion probabilities; decomposition into entry-point failure (zero-dose) and follow-up failure (started but did not complete DPT3)."));
body.push(Bb("Findings. ", "Continental cascade declines gradually rather than at a single break point: BCG 88.1%, DPT/Penta 1 85.9%, DPT/Penta 2 81.0%, DPT/Penta 3 74.2%, MCV1 74.7%. Largest mid-cascade leak is DPT2→DPT3 (−6.8 pp). Countries split into four policy quadrants: 21 functioning (both low), 6 entry-point dominant (incl. Nigeria), 4 follow-up dominant (incl. South Africa), 7 requiring comprehensive rebuild."));
body.push(Bb("Interpretation. ", "The DPT3→MCV1 dropoff commonly cited as a bottleneck is small at continental scale. The cascade leaks fastest mid-sequence and varies dramatically by country in how it fails. Intervention design should match failure type: outreach campaigns where entry-point dominates, reminder and defaulter systems where follow-up dominates."));

// INTRODUCTION
body.push(H1("1. Introduction"));
body.push(B("Childhood immunization in sub-Saharan Africa follows a sequential schedule of ~6 antigens delivered across the first year of life."));
body.push(B("Standard coverage reports (WHO/UNICEF WUENIC; DHS final reports) treat each antigen independently and present a single \"% coverage\" number per vaccine."));
body.push(B("This obscures the conditional structure of the cascade. A 70% DPT3 number can arise from very different system failures:"));
body.push(B("30% of children never started → an access problem (entry-point failure)", 1));
body.push(B("30% started but dropped out → a follow-up/retention problem", 1));
body.push(B("15% in each → a combined system weakness", 1));
body.push(B("The interventions are mutually distinct:"));
body.push(B("Entry-point failure ← outreach campaigns, mobile vaccination, geographical access, anti-distrust communication, zero-dose mapping (Gavi IRMMA/ZIPS)", 1));
body.push(B("Follow-up failure ← SMS/digital reminders, defaulter tracing, integration with other child-health visits", 1));
body.push(B("Prior literature has discussed DPT1-to-DPT3 dropout as a single metric (UNICEF \"dropout rate\") but has not systematically decomposed the cascade into entry vs follow-up components at continental scale."));
body.push(Bb("Aim. ", "Quantify the cascade structure across all available African DHS rounds and classify countries by their dominant failure mode to inform intervention prioritization."));

// METHODS
body.push(H1("2. Methods"));

body.push(H3("2.1 Data source"));
body.push(B("DHS Program Individual Recode (IR) hierarchical files for every sub-Saharan African country with at least one DHS round, 1989–2024."));
body.push(B("Files in CSPro fixed-width format with companion data dictionaries (.DCF). Survey-level metadata from .DCF; child-level vaccination from record types W43 (DHS-VII+) or 43 (older)."));
body.push(B("210 surveys extracted; 163 retained (≥30 dated dose-3 records per survey)."));

body.push(H3("2.2 Study population"));
body.push(B("Children aged 12–23 months at interview, born to women aged 15–49."));
body.push(B("N = 263,385 children across 163 surveys and 38 countries."));

body.push(H3("2.3 Vaccine receipt"));
body.push(B("Per child: BCG, OPV0, DPT1/2/3 OR Penta1/2/3 (depending on survey wave), OPV1/2/3, PCV1/2/3 (where available), Rotavirus 1/2 (where available), MCV1."));
body.push(Bb("Unified DPT/Penta series: ", "DHS migrated from DPT (H3/H5/H7) to Penta (H51/H52/H53) ~2010. For each child we use whichever was recorded; the other is marked \"Not Applicable.\""));
body.push(B("A dose counted as \"received\" if DHS status code was 1 (card date), 2 (mother recall), or 3 (card marked, date missing). Codes 0/8/9 excluded."));

body.push(H3("2.4 Cascade metrics (weighted)"));
body.push(Bb("Marginal coverage", " at each step: BCG, dose 1, dose 2, dose 3, MCV1."));
body.push(Bb("Conditional dose-completion probability: ", "P(dose k+1 | dose k = received)."));
body.push(Bb("Zero-dose rate: ", "% of children with NEITHER BCG NOR dose 1 — a conservative variant of WUENIC's \"no DPT1\"."));
body.push(Bb("Sample weights: ", "DHS V005 / 1,000,000. Cluster (V021) and strata (V022) preserved for downstream variance estimation."));

body.push(H3("2.5 Failure-type classification"));
body.push(Bb("Entry-point failure rate ", "= zero-dose rate."));
body.push(Bb("Follow-up failure rate ", "= 100% − P(dose 3 | dose 1)."));
body.push(B("Thresholds: entry ≥ 10% = \"high\"; follow-up ≥ 20% = \"high\". Four quadrants: Both low (maintain); Entry-point dominant (access/outreach); Follow-up dominant (reminders); Both high (rebuild)."));

body.push(H3("2.6 Software"));
body.push(B("Python 3.10 with pandas, numpy, matplotlib. ~800 lines, 3 scripts (extract_child_receipt.py, cascade_analysis.py, make_cascade_charts.py). Code provided as supplementary material."));

body.push(H3("2.7 Validation"));
body.push(B("Ethiopia 2016 DHS coverage estimates reproduced published EDHS-7 numbers for BCG (within 1.6 pp), DPT3 (0.9 pp), MCV1 (0.1 pp)."));

// RESULTS
body.push(H1("3. Results"));

body.push(H3("3.1 Continental cascade structure"));
body.push(...FIG("fig1_continent_dropout_funnel.png",
  "Figure 1.",
  "Continent-average cascade across the 38 latest DHS surveys per country. Cumulative percentage at each step with inter-step losses annotated. Largest leak is DPT2→DPT3 (−6.8 pp)."));
body.push(...FIG("fig_a1_sankey_cascade.png",
  "Figure 2.",
  "Continental dropout flow. Blue = children remaining on schedule. Red = children leaked at or before that step."));
body.push(Bb("BCG ", "88.1% — ~12% of children never enter the EPI system."));
body.push(Bb("Dose 1 ", "85.9% — 95% of BCG children come back for dose 1."));
body.push(Bb("DPT/Penta 3 ", "74.2% — the headline completion rate."));
body.push(Bb("MCV1 ", "74.7% — statistically indistinguishable from DPT3. The DPT3→MCV1 dropoff is NOT a continent-level phenomenon."));

body.push(H3("3.2 Conditional dose-completion probabilities"));
body.push(...FIG("fig2_conditional_prob_heatmap.png",
  "Figure 3.",
  "Country-level conditional dose-completion probabilities P(next | previous). Greener = stickier cascade. Sorted by P(MCV1 | DPT3)."));
body.push(B("P(dose 1 | BCG) = 95.0% — strong link"));
body.push(B("P(dose 2 | dose 1) = 93.5%"));
body.push(B("P(dose 3 | dose 2) = 90.3% — the largest mid-cascade leak"));
body.push(B("P(MCV1 | dose 3) = 88.3%"));
body.push(B("Each transition loses 5–10% of the prior cohort. Losses compound multiplicatively."));

body.push(H3("3.3 Country classification"));
body.push(...FIG("fig3_entry_vs_followup_quadrant.png",
  "Figure 4.",
  "Each country (latest DHS) plotted by entry-point failure (x) and follow-up failure (y). Four-quadrant classification with thresholds at 10% / 20%."));
body.push(...FIG("fig_a3_bubble_burden.png",
  "Figure 5.",
  "Same axes as Figure 4 with bubble size proportional to absolute number of zero-dose children per year (UN under-1 pop × entry-point failure %). Identifies countries with the largest absolute zero-dose populations."));
body.push(Bb("21 countries — Both low (maintain): ", "Burkina Faso, Burundi, Eswatini, Gabon, Gambia, Ghana, Kenya, Lesotho, Malawi, Mauritania, Namibia, Rwanda, Senegal, Sierra Leone, Sudan, São Tomé & P., Tanzania, Togo, Uganda, Zambia, Zimbabwe."));
body.push(Bb("6 countries — Entry-point dominant: ", "Benin, Cameroon, Comoros, Madagascar, Mali, Nigeria. Nigeria's 54% zero-dose rate dominates the continent's absolute zero-dose burden."));
body.push(Bb("4 countries — Follow-up dominant: ", "Congo (Brazzaville), Liberia, Niger, South Africa. South Africa is the most surprising — high health-system capacity but a measurable mid-cascade dropout."));
body.push(Bb("7 countries — Both high (rebuild): ", "Angola, Chad, Côte d'Ivoire, DR Congo, Ethiopia, Guinea, Mozambique. Account for a disproportionate share of unprotected children continent-wide."));

body.push(H3("3.4 Regional patterns"));
body.push(...FIG("fig_a2_regional_bars.png",
  "Figure 6.",
  "Cascade by region (latest survey per country, mean ± 1 SD). East and Southern Africa show flatter cascades and lower variance; West and Central Africa show steeper cascades and higher between-country variance."));
body.push(Bb("East Africa: ", "mean DPT3 ~75%."));
body.push(Bb("Southern Africa: ", "mean DPT3 ~76%."));
body.push(Bb("West Africa: ", "high between-country variance — Burkina Faso 89% next to Nigeria 38%."));
body.push(Bb("Central Africa: ", "mean DPT3 ~63% — the lowest of the four regions."));

body.push(H3("3.5 Country-level cascades"));
body.push(...FIG("fig4_country_small_multiples.png",
  "Figure 7.",
  "All 38 countries' cascades side by side (latest DHS). Provides an at-a-glance view of who has flat (functioning) vs steeply declining (broken) cascades."));
body.push(...FIG("fig_a5_status_decomposition.png",
  "Figure 8.",
  "For each country, the 12–23 month child population decomposed into four mutually exclusive categories: fully completed (MCV1), DPT3 complete but no MCV1, started but no DPT3, zero-dose. Stacked to 100%."));

body.push(H3("3.6 Change over time"));
body.push(...FIG("fig5_cascade_over_time.png",
  "Figure 9.",
  "Cascade evolution for the 8 countries with the most DHS rounds. Reveals improvers (Burkina Faso, Senegal), stagnators, and decliners."));
body.push(...FIG("fig_a4_change_over_time.png",
  "Figure 10.",
  "Percentage-point change in DPT3 coverage between earliest and latest DHS in panel, for countries with ≥3 rounds. Ranked."));
body.push(B("Several countries show large multi-decade gains in DPT3 coverage (Burkina Faso, Rwanda, Sierra Leone, Tanzania)."));
body.push(B("A handful show stagnation or modest decline (Nigeria coverage has fluctuated at the lower end)."));
body.push(B("Entry-point-dominant countries have made less progress than follow-up-dominant ones over the panel period."));

// DISCUSSION
body.push(H1("4. Discussion"));

body.push(H3("4.1 Main findings recapped"));
body.push(B("The EPI cascade leaks gradually, not at a single break point. Each transition loses 5–10% of the prior cohort."));
body.push(B("Largest single mid-cascade leak is DPT2→DPT3 (−6.8 pp on average)."));
body.push(B("DPT3 and MCV1 sit at essentially the same coverage level (~74%); the widely-cited \"measles outreach\" gap is not where the cascade breaks at continental scale."));
body.push(B("Country heterogeneity is enormous and patterned. Countries cluster into four meaningfully distinct policy regimes, not a single performance gradient."));

body.push(H3("4.2 Policy implications by quadrant"));
body.push(Bb("Both-low countries (n=21): ", "focus on the final 10% — typically marginalized urban and conflict-affected populations. Standard EPI strengthening continues to work."));
body.push(Bb("Entry-point dominant (n=6, incl. Nigeria): ", "the dominant lever is reaching unvaccinated children. Geographically targeted outreach, community health worker networks, zero-dose mapping. SMS reminders are not the primary lever — there's no number to send the SMS to."));
body.push(Bb("Follow-up dominant (n=4, incl. South Africa): ", "the dominant lever is completion. Default tracing, reminder systems, reducing missed-opportunity rates."));
body.push(Bb("Both high (n=7): ", "require integrated rebuilds. Single-lever interventions will under-perform."));

body.push(H3("4.3 Why the DPT2→DPT3 leak matters more than the DPT3→MCV1 gap"));
body.push(B("Children due for MCV1 at 9 months have already had three prior scheduled visits. The cohort arriving at the 9-month visit has been pre-selected by the DPT cascade."));
body.push(B("Improvements upstream (keeping DPT1/2/3 intervals tight) propagate downstream more efficiently than additional outreach at 9 months."));
body.push(B("Sequencing recommendation: strengthen 10-week→14-week interval delivery first, then MCV1 outreach."));

body.push(H3("4.4 Comparison with prior estimates"));
body.push(B("Our DPT3 estimates align closely with WUENIC for overlapping country-years."));
body.push(B("Novel contribution: cascade structure and quadrant classification, not the marginal numbers."));
body.push(B("Our zero-dose definition (no BCG AND no DPT1) is stricter than WUENIC's \"no DPT1\"; produces lower zero-dose rates but reduces false positives from single-antigen data error."));

body.push(H3("4.5 Limitations"));
body.push(Bb("Card vs recall doses pooled. ", "Recall bias may inflate coverage estimates by 5–10 pp. Robustness check: card-confirmed only does not change country quadrant assignments."));
body.push(Bb("Age cohort 12–23 months. ", "Older children may have received doses subsequently."));
body.push(Bb("EPI schedules vary. ", "WHO-standard windows used. Some countries shift MCV1 to 12 months."));
body.push(Bb("Sub-national variation hidden. ", "National panels mask large within-country inequities. Underlying child-level data preserves cluster and region variables."));
body.push(Bb("Latest survey is dated for some countries ", "(Niger 2012, Togo 2013, Eswatini 2006, São Tomé 2008). Treat classifications as conditional on latest available data."));

body.push(H3("4.6 Future work"));
body.push(B("Sub-national (region/cluster-level) replication using the same pipeline."));
body.push(B("Linkage with sub-national conflict, urbanicity, and wealth data to model determinants."));
body.push(B("Card-confirmed-only sensitivity analysis at full panel scale."));
body.push(B("Quantifying the DPT-to-Penta switchover effect on cascade completion."));

// FOOTER SECTIONS
body.push(H1("5. Funding & ethics"));
body.push(B("No external funding."));
body.push(B("Secondary analysis of de-identified public-use DHS data; no new human subjects research."));

body.push(H1("6. Data availability"));
body.push(B("DHS individual recode files: publicly available from the DHS Program (https://dhsprogram.com/) under registration."));
body.push(B("All analysis code and derived CSVs accompany this manuscript."));

body.push(H1("7. Acknowledgements"));
body.push(B("The DHS Program and participating Ministries of Health for the underlying surveys."));

// FIGURE LIST table
body.push(H1("Figure list (in manuscript order)"));
const figRows = [
  ["#", "Filename", "Purpose"],
  ["1", "fig1_continent_dropout_funnel.png", "Continental cascade with step-level losses"],
  ["2", "fig_a1_sankey_cascade.png", "Sankey flow showing cumulative cohort attrition"],
  ["3", "fig2_conditional_prob_heatmap.png", "Country × transition conditional probabilities"],
  ["4", "fig3_entry_vs_followup_quadrant.png", "Classification scatter"],
  ["5", "fig_a3_bubble_burden.png", "Burden-weighted bubble chart"],
  ["6", "fig_a2_regional_bars.png", "Regional comparison"],
  ["7", "fig4_country_small_multiples.png", "All-countries small multiples"],
  ["8", "fig_a5_status_decomposition.png", "Status decomposition stack"],
  ["9", "fig5_cascade_over_time.png", "Selected-country trajectories"],
  ["10", "fig_a4_change_over_time.png", "Long-run DPT3 change"],
];
const figTable = new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [600, 4000, 4760],
  rows: figRows.map((row, i) => tableRow(
    row.map((text, j) => ({ text, w: [600, 4000, 4760][j] })), i === 0
  )),
});
body.push(figTable);

// Supplementary tables
body.push(new Paragraph({ spacing: { before: 240 }, children: [new TextRun("")] }));
body.push(H1("Supplementary CSV files"));
const supRows = [
  ["Filename", "Content"],
  ["dropout_cascade_panel.csv", "163-row panel: every survey × cascade percentages + conditional probabilities"],
  ["country_classification.csv", "38 rows, latest survey per country, with failure_type label"],
  ["latest_survey_cascade.csv", "Same data, cleaner column set"],
  ["country_status_decomposition.csv", "Fully/partial/zero-dose decomposition per country"],
];
const supTable = new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [3600, 5760],
  rows: supRows.map((row, i) => tableRow(
    row.map((text, j) => ({ text, w: [3600, 5760][j] })), i === 0
  )),
});
body.push(supTable);

// Build document
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Calibri", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 30, bold: true, font: "Calibri", color: "1a3b6e" },
        paragraph: { spacing: { before: 360, after: 180 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Calibri", color: "1a3b6e" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 22, bold: true, font: "Calibri", color: "33567a" },
        paragraph: { spacing: { before: 180, after: 80 }, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      { reference: "bullets",
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
          { level: 1, format: LevelFormat.BULLET, text: "◦", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1440, hanging: 360 } } } },
        ] },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: "Research 2 — Manuscript Outline", size: 18, color: "888888", italics: true })],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Page ", size: 18, color: "888888" }),
            new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "888888" }),
          ],
        })],
      }),
    },
    children: body,
  }],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT, buf);
  console.log("Wrote", OUT, `(${buf.length} bytes)`);
});
