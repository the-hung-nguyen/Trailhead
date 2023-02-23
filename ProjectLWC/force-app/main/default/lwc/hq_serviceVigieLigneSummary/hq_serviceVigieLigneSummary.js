import { LightningElement, api } from 'lwc';
import layout from "./hq_serviceVigieLigneSummary.html";

const MOCK_DETAIL_DATA = [
    {
        hq_Contributeur__c: "123-1234-005",
        hq_Compteur__c: "M4SE-G123456",
        hq_PointDeMesure__c: "123-1234-000",
        dateHeureFin: 1547250828000,
        producteur: false,
        kw: 12.12,
        kva: 32750.5,
        KWh: 10.0,
        KVarPos: 6378.2188,
        KVarNeg: 3291.1234,
        FP: 0.9809
    },
    {
        hq_Contributeur__c: "123-1234-005",
        hq_Compteur__c: "M4SE-G123456",
        hq_PointDeMesure__c: "123-1234-000",
        dateHeureFin: 1547250828000,
        producteur: false,
        kw: 123.12,
        kva: 32750.5,
        KWh: 20.22,
        KVarPos: 6378.2188,
        KVarNeg: 3291.1234,
        FP: 0.9809
    },
    {
        hq_Contributeur__c: "456-1234-003",
        hq_Compteur__c: "M5ST-G456789",
        hq_PointDeMesure__c: "456-1234-123",
        dateHeureFin: 1547250828000,
        producteur: false,
        kw: 100.10,
        kva: 32750.6,
        KWh: 500.11,
        KVarPos: 2032.4322,
        KVarNeg: 1242.4443,
        FP: 0.6802,
        estTotalise: false
    },
    {
        hq_Contributeur__c: "456-1234-003",
        hq_Compteur__c: "M5ST-G456789",
        hq_PointDeMesure__c: "456-1234-123",
        dateHeureFin: 1547250828000,
        producteur: false,
        kw: 200.00,
        kva: 32750.6,
        KWh: 500.11,
        KVarPos: 2032.4322,
        KVarNeg: 1242.4443,
        FP: 0.6802,
        estTotalise: false
    },
    {
        hq_Contributeur__c: "123-1234-005",
        hq_Compteur__c: "M4SE-G123456",
        hq_PointDeMesure__c: "123-1234-000",
        dateHeureFin: 1547250828000,
        producteur: false,
        kw: 110.0,
        kva: 32750.5,
        KWh: 50.00,
        KVarPos: 6378.2188,
        KVarNeg: 3291.1234,
        FP: 0.9809
    },
    {
        hq_Contributeur__c: "123-1234-005",
        hq_Compteur__c: "M4SE-G123456",
        hq_PointDeMesure__c: "123-1234-000",
        dateHeureFin: 1547250828000,
        producteur: true,
        kw: 1000.0,
        kva: 32750.5,
        KWh: 2500.00,
        KVarPos: 6378.2188,
        KVarNeg: 3291.1234,
        FP: 0.9809
    },
    {
        hq_Contributeur__c: "123-1234-005",
        hq_Compteur__c: "M4SE-G123456",
        hq_PointDeMesure__c: "123-1234-000",
        dateHeureFin: 1547250828000,
        producteur: true,
        kw: 2000.0,
        kva: 32750.5,
        KWh: 1000.00,
        KVarPos: 6378.2188,
        KVarNeg: 3291.1234,
        FP: 0.9809
    },
    {
        hq_Contributeur__c: "123-1234-006",
        hq_Compteur__c: "M4SE-G123456",
        hq_PointDeMesure__c: "123-1234-000",
        dateHeureFin: 1547250828000,
        producteur: true,
        kw: 2000.0,
        kva: 32750.5,
        KWh: 1000.00,
        KVarPos: 6378.2188,
        KVarNeg: 3291.1234,
        FP: 0.9809
    }
];
 

/* Find the summary for a measuring point. Return index of the data summary object. */
const findMeasuringPtSummary = (listSumData, contributor, producer) => {
    let length = listSumData.length;
    if (length == 0)
        return -1;
    for (let i = 0; i < length; i++) {
        if (listSumData[i].hq_Contributeur__c == contributor && listSumData[i].producteur == producer)
            return i;
    }
    return -1;
};

 
/* Add a summary data for a measuring point. Return index of the data summary object. */
const addMeasuringPtSummary = (listSumData, detailData) => {
    return listSumData.push({
        hq_Contributeur__c:detailData.hq_Contributeur__c,
        producteur:detailData.producteur,
        kWh:detailData.KWh,
        usageFactor:123.4,
        numberIntervals:1,
        numberIntervalsZero:detailData.kw == 0 ? 1:0,
        maxPowerFactor:0.0,
        kWMin:detailData.kw,
        kWMinDate:detailData.dateHeureFin,
        kWMax:detailData.kw,
        kWMaxDate:detailData.dateHeureFin,
        kVAMin:detailData.kva,
        kVAMinDate:detailData.dateHeureFin,
        kVAMax:detailData.kva,
        kVAMaxDate:detailData.dateHeureFin}) - 1;
};
 

const calculateSummaryData = (listSumData, detailData) => {
    // Verify if a summary data object for the measuring point exist
    // if not create summary for the measuring point.
    let mpSummaryIndex = findMeasuringPtSummary(listSumData, detailData.hq_Contributeur__c, detailData.producteur);
    if (mpSummaryIndex == -1) {
        mpSummaryIndex = addMeasuringPtSummary(listSumData, detailData);
        return;
    }
   
    // update the summary for the measuring point
    listSumData[mpSummaryIndex].kWh += detailData.KWh;
    listSumData[mpSummaryIndex].numberIntervals += 1;
    if (detailData.kw == 0) listSumData[mpSummaryIndex].numberIntervalsZero += 1;
    if (detailData.kw < listSumData[mpSummaryIndex].kWMin) {
        listSumData[mpSummaryIndex].kWMin = detailData.kw;
        listSumData[mpSummaryIndex].kWMinDate = detailData.dateHeureFin;
    };
    if (detailData.kw > listSumData[mpSummaryIndex].kWMax) {
        listSumData[mpSummaryIndex].kWMax = detailData.kw;
        listSumData[mpSummaryIndex].kWMaxDate = detailData.dateHeureFin;
    }
    if (detailData.kva < listSumData[mpSummaryIndex].kVAMin) {
        listSumData[mpSummaryIndex].kVAMin = detailData.kva;
        listSumData[mpSummaryIndex].kVAMinDate = detailData.dateHeureFin;
    };
    if (detailData.kva > listSumData[mpSummaryIndex].kVAMax) {
        listSumData[mpSummaryIndex].kVAMax = detailData.kva;
        listSumData[mpSummaryIndex].kVAMaxDate = detailData.dateHeureFin;
    }
};

const buildSummaryData = (listSumData, listDetailData) => {
    for (let i = 0; i < listDetailData.length; i++) {
        calculateSummaryData(listSumData, listDetailData[i]);
    }
};

export default class Hq_serviceVigieLigneSummary extends LightningElement {
    @api listDetailData;
   
    listSummaryData = [];
    listDetailData = MOCK_DETAIL_DATA;
    activeContributeur = "";

    render() {
        buildSummaryData(this.listSummaryData, this.listDetailData);
        if (this.listSummaryData.length > 0) this.activeContributeur = this.listSummaryData[0].hq_Contributeur__c;
        this.listSummaryData.forEach((summaryData) => (summaryData.maxPowerFactor = summaryData.kWMax / summaryData.kVAMax * 100));
        return layout;
    }
}