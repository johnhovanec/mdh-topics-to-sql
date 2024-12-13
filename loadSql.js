const fs = require("fs");
const path = require("path");

// Specify the file path
const filePath = path.join(__dirname, "topicsForSql.json");

// Parses a JSON tab chunk of data from topics.js
function readAndParseJSFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // Attempt to parse the content as JSON
    try {
      const jsonData = JSON.parse(fileContent);
      return jsonData;
    } catch (jsonError) {
      console.error("Invalid JSON:", jsonError);

      // If not valid JSON, try to evaluate it as JavaScript
      try {
        const jsData = eval("(" + fileContent + ")");
        return jsData;
      } catch (evalError) {
        console.error("Error evaluating JavaScript:", evalError);
        return null; // Or handle the error as needed
      }
    }
  } catch (readError) {
    console.error("Error reading file:", readError);
    return null; // Or handle the error as needed
  }
}

// Formats string properties to use quotes unless the values is null
function format(word) {
  if (word === null || word === "") {
    return null;
  } else {
    return "'" + word + "'";
  }
}

const tabData = readAndParseJSFile(filePath);

/***********************************************************************************************************************/
// Tabs
/***********************************************************************************************************************/
//theme = 11

const theme_ID = 11;
const tabTitle = format(tabData.tabTitle ?? null);
const tabPath = format(tabData.tabPath ?? null);
const contentType = format(tabData.contentType ?? null);
const exportTitle = format(tabData.exportTitle ?? null);
const chartType = format(tabData.chartType ?? null);
const selectable = tabData.selectable === true ? 1 : 0;
const baseline = format(tabData.baseline ?? null);
const defaultSelection = format(tabData.defaultSelection ?? null);
const infoTitle = format(tabData?.info?.title ?? null);
const infoID = format(tabData?.info?.id ?? null);
const infoSubtitle = format(tabData?.info?.subtitle ?? null);
const chartTitle = format(tabData.chartTitle ?? null);
const displayChartTitle = tabData.displayChartTitle === true ? 1 : 0;
const chartYAxisField = format(tabData.chartYAxisField ?? null);
const displayChartDiscontinuityGraphic =
  tabData.displayChartDiscontinuityGraphic === true ? 1 : 0;
const displayXAxisLabel = tabData.displayXAxisLabel === true ? 1 : 0;
const xAxisLabel = format(tabData.xAxisLabel ?? null);
const url = format(tabData.url ?? null);
const tableTitle = format(tabData.tableTitle ?? null);
const stratifiable = tabData.stratifiable === true ? 1 : 0;
const chartSubtitle = format(tabData.chartSubtitle ?? null);
const tableSubtitle = format(tabData.tableSubtitle ?? null);
const defaultTab = tabData.defaultTab === true ? 1 : 0;
const textHeader = format(tabData.textHeader ?? null);
const textSubheading = format(tabData.textSubheading ?? null);
const textBody = format(tabData.textBody ?? null);
const exportSubtitle = format(tabData.exportSubtitle ?? null);
const contentTitle = format(tabData.contentTitle ?? null);
const displayChartSubtitle = tabData.displayChartSubtitle === true ? 1 : 0;
const displayYAxisLabel = tabData.displayYAxisLabel === true ? 1 : 0;
const yAxisLabel = format(tabData.yAxisLabel ?? null);
const chartXAxisField = format(tabData.chartXAxisField ?? null);
const defaultStratification = format(tabData.defaultStratification ?? null);

if (!tabPath) {
  throw Error("tabPath must be defined");
}

const tabCmd = `INSERT INTO epht.Config_Tab_Test VALUES
(
    ${theme_ID}, ${tabTitle}, ${tabPath}, ${contentType},
    ${exportTitle}, ${chartType}, ${selectable}, ${baseline},
    ${defaultSelection}, ${infoTitle}, ${infoID}, ${infoSubtitle},
    ${chartTitle}, ${displayChartTitle}, ${chartYAxisField}, ${displayChartDiscontinuityGraphic},
    ${displayXAxisLabel}, ${xAxisLabel}, ${url}, ${tableTitle},
    ${stratifiable}, ${chartSubtitle}, ${tableSubtitle}, ${defaultTab},
    ${textHeader}, ${textSubheading}, ${textBody}, ${exportSubtitle},
    ${contentTitle}, ${displayChartSubtitle}, ${displayYAxisLabel}, ${yAxisLabel},
    ${chartXAxisField}, ${defaultStratification}
)\n`;

console.log(tabCmd);

/***********************************************************************************************************************/
// Once the tab is created all chart configs will use the same Tab_Id
// tab = 21
const tab_ID = 21;
/***********************************************************************************************************************/

/***********************************************************************************************************************/
// ChartDataSets
/***********************************************************************************************************************/

const dataSets = tabData?.chartDataSets;

let values = dataSets.map((set) => {
  return `(${tab_ID}, '${set}')\n`;
});

const dataSetCmd = `INSERT INTO epht.Config_Tab_ChartDataSet_Test VALUES 
${values}`;

console.log(dataSetCmd);

/***********************************************************************************************************************/
// UrlParams
/***********************************************************************************************************************/

const urlParams = tabData?.urlParams;

let params = urlParams.map((x) => {
  let value = format(x.value ?? null);
  let valueKey = format(x.valueKey ?? null);

  return `(${tab_ID}, '${x.param}', ${value}, ${valueKey})\n`;
});

const urlParamsCmd = `INSERT INTO epht.Config_Tab_UrlParam_Test VALUES  
${params}`;

console.log(urlParamsCmd);

/***********************************************************************************************************************/
// DefaultSetName
/***********************************************************************************************************************/

const defaultSetNames = tabData?.defaultSetNames;

let setNames = defaultSetNames.map((x) => {
  let setName = format(x ?? null);
  return `(${tab_ID}, ${setName})\n`;
});

const defaultSetNamesCmd = `INSERT INTO epht.Config_Tab_DefaultSetName_Test VALUES
${setNames}`;

console.log(defaultSetNamesCmd);

/***********************************************************************************************************************/
// Stratifications
/***********************************************************************************************************************/

/***********************************************************************************************************************/
// ChartConfig
/***********************************************************************************************************************/

const chartConfig = tabData?.chartConfig;

let keys = Object.keys(chartConfig);
let config;

keys.forEach((key) => {
  // Check for stratificationDatasets
  if (key === "stratificationDatasets") {
    let stratificationDatasets = chartConfig.stratificationDatasets;
    buildDataSet(stratificationDatasets);
  }
  // Check for mainDatasets
  else if (key === "mainDatasets") {
    let mainDatasets = chartConfig.mainDatasets;
    buildDataSet(mainDatasets);
  }
  // Check for unnamed datasets and treat them as mainDatasets
  else {
    let mainDatasets = chartConfig;
    key = "mainDatasets";
    buildDataSet(mainDatasets);
  }

  function buildDataSet(dataset) {
    config = dataset.map((obj) => {
      let label = format(obj.label ?? null);
      let setName = format(obj.setName ?? null);
      let fill = obj.fill === true ? 1 : 0;
      let order = obj.order ?? 0; // tinyint
      let yAxisID = format(obj.yAxisID ?? null);
      let type = format(obj.type ?? null);
      let pointRadius = obj.pointRadius ?? 0; // tinyint
      let pointBorderWidth = obj.pointBorderWidth ?? 0; // tinyint
      let pointHoverRadius = obj.pointHoverRadius ?? 0; // tinyint
      let pointHoverBorderWidth = obj.pointHoverBorderWidth ?? 0; // tinyint
      let lineTension = obj.lineTension ?? 0; // tinyint
      let borderWidth = obj.borderWidth ?? 0; // tinyint
      let stratification = format(obj.stratification ?? null);
      let title = format(obj.title ?? null);
      let baseline = obj.baseline === true ? 1 : 0;
      let datasetType = format(key);
      let data = null; // data is omitted, to be set in the front-end

      return `(${tab_ID}, ${label}, ${setName}, ${fill}, ${order}, 
            ${yAxisID}, ${type}, ${pointRadius}, ${pointBorderWidth}, ${pointHoverRadius},
            ${pointHoverBorderWidth}, ${lineTension}, ${borderWidth}, ${stratification},
            ${title}, ${baseline}, ${datasetType}, ${data})\n`;
    });
  }
  const chartConfigCmd = `INSERT INTO epht.Config_Tab_ChartConfig_Test VALUES 
  ${config}`;

  config.length ? console.log(chartConfigCmd) : null;
});

/***********************************************************************************************************************/
// ColumnHeaders
/***********************************************************************************************************************/

const columnHeaders = tabData?.columnHeaders;

let headers = columnHeaders.map((header) => {
  let field = format(header.field ?? null);
  let headerName = format(header.headerName ?? null);
  let exportHeaderName = format(header.exportHeaderName ?? null);
  let width = header.width ?? 0;
  let align = format(header.align ?? null);
  let headerAlign = format(header.headerAlign ?? null);
  let customFormat = header.customFormat ?? 0;
  let stratification = format(header.stratification ?? null);

  return `(${tab_ID}, ${field}, ${headerName}, ${exportHeaderName}, ${width}, ${align}, ${headerAlign}, ${customFormat}, ${stratification})\n`;
});

const columnHeadersCmd = `INSERT INTO epht.Config_Tab_ColumnHeader_Test VALUES ${headers}`;

console.log(columnHeadersCmd);
