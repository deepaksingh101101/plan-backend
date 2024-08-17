// models/formModel.js

import mongoose from 'mongoose';

const questionAnswerSchema = new mongoose.Schema({
    question: String,
    answer: String,
});

const investmentSchema = new mongoose.Schema({
    item: questionAnswerSchema,
    amount: questionAnswerSchema,
});

const operationsCostSchema = new mongoose.Schema({
    costOfGoodsSold: { question: String, percent: String, total: String },
    wagesAndBenefits: { question: String, percent: String, total: String },
    marketing: { question: String, percent: String, total: String },
    rent: { question: String, percent: String, total: String },
    generalAndAdministrative: { question: String, percent: String, total: String },
    depreciation: { question: String, percent: String, total: String },
    utilities: { question: String, percent: String, total: String },
    otherExpenses: { question: String, percent: String, total: String },
    interestExpenses: { question: String, percent: String, total: String },
    incomeTaxes: { question: String, percent: String, total: String },
});

const formSchema = new mongoose.Schema({
    firstForm: {
        businessType: questionAnswerSchema,
        businessPlan: questionAnswerSchema,
    },
    secondForm: {
        businessName: questionAnswerSchema,
        businessDescription: questionAnswerSchema,
        numberOfEmployees: questionAnswerSchema,
        productService: questionAnswerSchema,
        salesChannel: questionAnswerSchema,
        customerLocation: questionAnswerSchema,
    },
    thirdForm: {
        customerGroup1Description: questionAnswerSchema,
        customerGroup1IncomeLevel: questionAnswerSchema,
        customerGroup2Description: questionAnswerSchema,
        customerGroup2IncomeLevel: questionAnswerSchema,
        customerGroup3Description: questionAnswerSchema,
        customerGroup3IncomeLevel: questionAnswerSchema,
    },
    fourthForm: {
        product1Name: questionAnswerSchema,
        product1Description: questionAnswerSchema,
        product2Name: questionAnswerSchema,
        product2Description: questionAnswerSchema,
        product3Name: questionAnswerSchema,
        product3Description: questionAnswerSchema,
        product4Name: questionAnswerSchema,
        product4Description: questionAnswerSchema,
        product5Name: questionAnswerSchema,
        product5Description: questionAnswerSchema,
    },
    fifthForm: {
        successDriver1: questionAnswerSchema,
        successDriver2: questionAnswerSchema,
        successDriver3: questionAnswerSchema,
        weakness1: questionAnswerSchema,
        weakness2: questionAnswerSchema,
        weakness3: questionAnswerSchema,
    },
    sixthForm: {
        selectedCurrency: questionAnswerSchema,
        investmentItems: [investmentSchema],
    },
    seventhForm: {
        firstYearRevenue: questionAnswerSchema,
        revenueGrowth: questionAnswerSchema,
        operationsCost: operationsCostSchema,
        firstYearTotalCost: questionAnswerSchema,
        firstYearNetProfit: questionAnswerSchema,
        netProfitMargin: questionAnswerSchema,
        planLanguage: questionAnswerSchema,
    },
}, { timestamps: true });

const FormModel = mongoose.model('Form', formSchema);

export default FormModel;
