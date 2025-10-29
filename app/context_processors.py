ALGORITHM_NAME2ID = {
    # tabular
    # preprocessing
    "DisparateImpactRemover": "dir",
    "LearningFairRepresentation": "lfr",
    "Reweighing": "rw",
    "OptimPreproc": "optimpreproc",
    "FairStreamingPCA": "fairpca",
    "FairBatch": "fairbatch",
    # inprocessing
    "MetaFairClassifier": "mfc",
    "PrejudiceRemover": "prejremover",
    "SLIDE": "slide",
    "FTM": "ftm",
    "ExponentiatedGradientReduction": "egr",
    "KernelDensityEstimation": "kde",
    "GerryFairClassifier": "gfc",
    "AdversarialDebiasing": "ad",
    "sIPMLFR": "sipmlfr",
    # postprocessing
    "CalibratedEqOdds": "ceo",
    "EqualizedOdds": "eo",
    "RejectOptionClassifier": "roc",
    "CasualPathTracing": "cpt",
    "Ember": "ember",
    # image-inprocessing
    "FairDimensionFiltering": "fdf",
    "FairFeatureDistillation": "ffd",
    "FairnessVAE": "fvae",
    "LearningFromFairness": "lff",
    # audio
    "INTapt": "intapt",
    # text
    "RepresentativenessHeuristic": "rh",
    "Latte": "latte",
    "CREHate": "crehate",
    "KoBBQ": "kobbq",
    "ConCSE": "concse",
}

ALGORITHM_ID2NAME = {
    ALGORITHM_NAME2ID[algo_id]: algo_id for algo_id in ALGORITHM_NAME2ID.keys()
}


def algorithm_id(request):
    return ALGORITHM_NAME2ID
