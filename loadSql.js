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

const data = readAndParseJSFile(filePath);

/***********************************************************************************************************************/
// Tabs
/***********************************************************************************************************************/

const theme_ID = 12;
const tabTitle = format(data.tabTitle ?? null);
const tabPath = format(data.tabPath ?? null);
const contentType = format(data.contentType ?? null);
const exportTitle = format(data.exportTitle ?? null);
const chartType = format(data.chartType ?? null);
const selectable = data.selectable === true ? 1 : 0;
const baseline = format(data.baseline ?? null);
const defaultSelection = format(data.defaultSelection ?? null);
const infoTitle = format(data?.info?.title ?? null);
const infoID = format(data?.info?.id ?? null);
const infoSubtitle = format(data?.info?.subtitle ?? null);
const chartTitle = format(data.chartTitle ?? null);
const displayChartTitle = data.displayChartTitle === true ? 1 : 0;
const chartYAxisField = format(data.chartYAxisField ?? null);
const displayChartDiscontinuityGraphic =
  data.displayChartDiscontinuityGraphic === true ? 1 : 0;
const displayXAxisLabel = data.displayXAxisLabel === true ? 1 : 0;
const xAxisLabel = format(data.xAxisLabel ?? null);
const url = format(data.url ?? null);
const tableTitle = format(data.tableTitle ?? null);
const stratifiable = data.stratifiable === true ? 1 : 0;
const chartSubtitle = format(data.chartSubtitle ?? null);
const tableSubtitle = format(data.tableSubtitle ?? null);
const defaultTab = data.defaultTab === true ? 1 : 0;
const textHeader = format(data.textHeader ?? null);
const textSubheading = format(data.textSubheading ?? null);
const textBody = format(data.textBody ?? null);
const exportSubtitle = format(data.exportSubtitle ?? null);
const contentTitle = format(data.contentTitle ?? null);
const displayChartSubtitle = data.displayChartSubtitle === true ? 1 : 0;
const displayYAxisLabel = data.displayYAxisLabel === true ? 1 : 0;
const yAxisLabel = format(data.yAxisLabel ?? null);
const chartXAxisField = format(data.chartXAxisField ?? null);
const defaultStratification = format(data.defaultStratification ?? null);

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
const tab_ID = 28;
/***********************************************************************************************************************/

/***********************************************************************************************************************/
// MapSets
/***********************************************************************************************************************/
/***********************************************************************************************************************/
// Once the mapset is created all map configs will use the same mapSet_ID
const mapSet_ID = 10;
/***********************************************************************************************************************/

const mapSets = data?.mapSets;

if (mapSets != null) {
  let values = mapSets.map((mapSet) => {
    const set = format(mapSet.set ?? null);
    const geometry = format(mapSet.geometry ?? null);
    const tableTitle = format(mapSet.tableTitle ?? null);

    //Get nested object for each mapSet
    getOutFields(mapSet);
    getColumnHeaders(mapSet);
    getPopupContent(mapSet);
    getSetLayers(mapSet);

    return `(${tab_ID}, ${set}, ${geometry}, ${tableTitle})\n`;
  });

  const mapSetCmd = `INSERT INTO epht.Config_Tab_MapSet_Test VALUES
${values}\n`;

  console.log(mapSetCmd);
}

/***********************************************************************************************************************/
// Maps: OutFields
/***********************************************************************************************************************/

function getOutFields(mapSet) {
  const outFields = mapSet?.outFields;

  if (outFields != null) {
    let values = outFields.map((outField) => {
      let outFieldName = format(outField ?? null);

      return `(${mapSet_ID}, ${outFieldName})\n`;
    });

    const outFieldsCmd = `INSERT INTO epht.Config_MapSet_Outfield_Test VALUES
${values}`;

    console.log(outFieldsCmd);
  }
}

/***********************************************************************************************************************/
// Maps: ColumnHeaders
/***********************************************************************************************************************/

function getColumnHeaders(mapSet) {
  const columnHeaders = mapSet?.columnHeaders;

  if (columnHeaders != null) {
    let values = columnHeaders.map((header) => {
      let field = format(header.field ?? null);
      let headerName = format(header.headerName ?? null);
      let width = header.width ?? 0;
      let align = format(header.align ?? null);
      let headerAlign = format(header.headerAlign ?? null);
      let flex = header.flex ?? 0;
      let exportHeaderName = format(header.exportHeaderName ?? null);
      let customFormat = header.customFormat ?? 0;
      let fn = format(header.fn ?? null);

      return `(${mapSet_ID}, ${field}, ${headerName}, ${width}, ${align}, ${headerAlign}, ${flex}, ${exportHeaderName}, ${customFormat}, ${fn})\n`;
    });

    const columnHeadersCmd = `INSERT INTO epht.Config_MapSet_ColumnHeader_Test VALUES
${values}`;

    console.log(columnHeadersCmd);
  }
}

/***********************************************************************************************************************/
// Maps: PopupContent
/***********************************************************************************************************************/

function getPopupContent(mapSet) {
  const popupContent = mapSet?.popupContent;
  const popupTypes = Object.keys(popupContent);

  if (popupContent != null) {
    let values = popupTypes.map((type) => {
      let content = popupContent[type];
      let popupType = format(type ?? null);
      let field = format(content.field ?? null);
      let name = format(content.name ?? null);
      let className = format(content.className ?? null);
      let unit = format(content.unit ?? null);

      return `(${mapSet_ID}, ${popupType}, ${field}, ${name}, ${className}, ${unit})\n`;
    });

    const popupContentCmd = `INSERT INTO epht.Config_MapSet_PopupContent_Test VALUES
${values}`;

    console.log(popupContentCmd);
  }
}

/***********************************************************************************************************************/
// Maps: SetLayers
/***********************************************************************************************************************/

function getSetLayers(mapSet) {
  const setLayers = mapSet?.setLayers;

  if (setLayers != null) {
    let values = setLayers.map((set) => {
      let id = format(set.id ?? null);
      let title = format(set.title ?? null);
      let subTitle = format(set.subtitle ?? null);
      let zIndexPosition = format(set.zIndexPosition ?? null);
      let yearKey = format(set.yearKey ?? null);
      let customSortField = format(set.customSortField ?? null);
      let symbolDescription = format(set.symbolDescription ?? null);
      let referenceLayer = set.referenceLayer === true ? 1 : 0;
      let defaultVisible = set.defaultVisible === true ? 1 : 0;
      let sourceLayer = set.sourceLayer === true ? 1 : 0;
      let toggleable = set.toggleable === true ? 1 : 0;
      let scaleDependent = set.scaleDependent === true ? 1 : 0;
      let custom = set.custom === true ? 1 : 0;
      let isModern = set.isModern === true ? 1 : 0;
      let omitCommunityProfile = set.omitCommunityProfile === true ? 1 : 0;
      let url = format(set.url ?? null);
      let customStyleTitle = format(set.customStyleTitle ?? null);
      let type = format(set.type ?? null);

      return `(${mapSet_ID}, ${id}, ${title}, ${subTitle}, 
      ${zIndexPosition}, ${yearKey}, ${customSortField}, ${symbolDescription}, 
      ${referenceLayer}, ${defaultVisible}, ${sourceLayer}, ${toggleable}, 
      ${scaleDependent}, ${custom}, ${isModern}, ${omitCommunityProfile}, 
      ${url}, ${customStyleTitle}, ${type})\n`;
    });

    const setLayersCmd = `INSERT INTO epht.Config_MapSet_SetLayer_Test VALUES 
${values}`;

    console.log(setLayersCmd);
  }
}

/***********************************************************************************************************************/
// Charts: ChartDataSets
/***********************************************************************************************************************/

const dataSets = data?.chartDataSets;

if (dataSets != null) {
  let values = dataSets.map((set) => {
    return `(${tab_ID}, '${set}')\n`;
  });

  const dataSetCmd = `INSERT INTO epht.Config_Tab_ChartDataSet_Test VALUES 
${values}`;

  console.log(dataSetCmd);
}

/***********************************************************************************************************************/
// Charts: UrlParams
/***********************************************************************************************************************/

const urlParams = data?.urlParams;

if (urlParams != null) {
  let params = urlParams.map((x) => {
    let value = format(x.value ?? null);
    let valueKey = format(x.valueKey ?? null);

    return `(${tab_ID}, '${x.param}', ${value}, ${valueKey})\n`;
  });

  const urlParamsCmd = `INSERT INTO epht.Config_Tab_UrlParam_Test VALUES  
${params}`;

  console.log(urlParamsCmd);
}

/***********************************************************************************************************************/
// Charts: DefaultSetName
/***********************************************************************************************************************/

const defaultSetNames = data?.defaultSetNames;

if (defaultSetNames != null) {
  let setNames = defaultSetNames.map((x) => {
    let setName = format(x ?? null);
    return `(${tab_ID}, ${setName})\n`;
  });

  const defaultSetNamesCmd = `INSERT INTO epht.Config_Tab_DefaultSetName_Test VALUES
${setNames}`;

  console.log(defaultSetNamesCmd);
}

/***********************************************************************************************************************/
// Charts: Stratifications
/***********************************************************************************************************************/

const stratifications = data?.stratifications;

if (stratifications != null) {
  let setNames = stratifications.map((x) => {
    let title = format(x.title ?? null);
    let field = format(x.field ?? null);
    return `(${tab_ID}, ${title}, ${field})\n`;
  });

  const stratificationsCmd = `INSERT INTO epht.Config_Tab_Stratification_Test VALUES
${setNames}`;

  console.log(stratificationsCmd);
}

/***********************************************************************************************************************/
// Charts: ChartConfig
/***********************************************************************************************************************/

const chartConfig = data?.chartConfig;

if (chartConfig != null) {
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
}

/***********************************************************************************************************************/
// Charts: ColumnHeaders
/***********************************************************************************************************************/

const columnHeaders = data?.columnHeaders;

if (chartConfig != null) {
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
}

/***********************************************************************************************************************/
// Tables
/***********************************************************************************************************************/
const tableColumnHeaders = data?.columnHeaders;

if (tableColumnHeaders != null) {
  let headers = tableColumnHeaders.map((header) => {
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

  const tableColumnHeadersCmd = `INSERT INTO epht.Config_Tab_ColumnHeader_Test VALUES
${headers}`;

  console.log(tableColumnHeadersCmd);
}
