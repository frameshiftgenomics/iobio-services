class FilterModel {

  constructor(globalApp, affectedInfo, isBasicMode, isFullAnalysis) {
    this.globalApp = globalApp;
    this.affectedInfo = affectedInfo;

    this.isBasicMode = isBasicMode;
    this.isFullAnalysis = isFullAnalysis;

    this.annotsToInclude = new Object();

    this.regionStart = null;
    this.regionEnd = null;

    this.pathogenicityScheme = "clinvar";

    this.annotClasses     = ".type, .impact, ." + this.globalApp.impactFieldToFilter + ", .effect, .vepConsequence, .sift, .polyphen, .regulatory, .zygosity, .inheritance, .clinvar, .uasibs, .recfilter";
    this.annotClassLabels = "Type, Impact, VEP Impact, Effect, VEP Consequence, SIFT, PolyPhen, Regulatory, Zygosity, Inheritance mode, ClinVar, Unaffected Sibs, VCF Filter Status";

    this.applyLowCoverageFilter = false;

    // standard filters
    this.KNOWN_CAUSATIVE           = "known_causative";
    this.DENOVO                    = "denovo";
    this.RECESSIVE                 = "recessive";
    this.FUNCTIONAL_IMPACT         = "functional_impact";
    this.LOW_COVERAGE              = "low_coverage";


    this.snpEffEffects = {};
    this.vepConsequences = {};
    this.exonicOnlyFilter = false;
    this.recFilters = {};

    this.geneCoverageMin           = 10;
    this.geneCoverageMean          = 15;
    this.geneCoverageMedian        = 15;



    this.flagCriterion = {
      gene: {
        'reviewed': {
          active: false,
          custom: false,
          title: "Reviewed",
          name: "Variants with notes and/or interpretation",
          order: 0,
          userFlagged: false,
          maxAf: null,
          clinvar: null,
          impact: null,
          consequence: null,
          inheritance: null,
          zyosity: null,
          minGenotypeDepth: null,
          minGenotypeAltCount: null,
          minRevel: null,
          exclusiveOf: null
        },
        'pathogenic': {
          active: true,
          custom: false,
          title: "Pathogenic in ClinVar",
          name: "Pathogenic, likely pathogenic ClinVar, low allele freq",
          order: 1,
          userFlagged: false,
          maxAf: .05,
          clinvar: ['clinvar_path', 'clinvar_lpath'],
          impact: null,
          consequence: null,
          inheritance: null,
          zyosity: null,
          minGenotypeDepth: null,
          minGenotypeAltCount: null,
          minRevel: null,
          exclusiveOf: null
        },
        'autosomalDominant': {
          active: true,
          custom: false,
          title: "Autosomal dominant",
          name: "Autosomal dominant inhertance, low allele freq",
          order: 2,
          userFlagged: false,
          maxAf: .01,
          clinvar: null,
          impact: ['HIGH', 'MODERATE'],
          consequence: null,
          inheritance: ['autosomal dominant'],
          zyosity: null,
          minGenotypeDepth: null,
          minGenotypeAltCount: null,
          minRevel: null,
          exclusiveOf: ['pathogenic']
        },
        'recessive': {
          active: true,
          custom: false,
          title:"Recessive",
          name: "Recessive inheritance, low allele freq",
          order: 3,
          userFlagged: false,
          maxAf: .01,
          clinvar: null,
          impact: ['HIGH', 'MODERATE'],
          consequence: null,
          inheritance: ['recessive'],
          zyosity: null,
          minGenotypeDepth: null,
          minGenotypeAltCount: 5,
          minRevel: null,
          isUserFlagged: false,
          exclusiveOf: ['pathogenic']
        },
        'denovo': {
          active: true,
          custom: false,
          title: "De novo",
          name: "De novo inheritance, low allele freq",
          order: 4,
          userFlagged: false,
          maxAf: .01,
          clinvar: null,
          impact: ['HIGH', 'MODERATE'],
          consequence: null,
          inheritance: ['denovo'],
          zyosity: null,
          minGenotypeDepth: null,
          minGenotypeAltCount: 5,
          minRevel: null,
          exclusiveOf: ['pathogenic']
        },
        'compoundHet': {
          active: true,
          custom: false,
          title: "Compound hets",
          name: "Compound het inheritance, low allele freq",
          order: 5,
          userFlagged: false,
          maxAf: .05,
          clinvar: null,
          impact: ['HIGH', 'MODERATE'],
          consequence: null,
          inheritance: ['compound het'],
          zyosity: null,
          minGenotypeDepth: null,
          minGenotypeAltCount: null,
          minRevel: null,
          exclusiveOf: ['pathogenic']
        },
        'xlinked': {
          active: true,
          custom: false,
          title: "X-linked recessive",
          name: "X-linked recessive inheritance, low allele freq",
          userFlagged: false,
          order: 6,
          maxAf: .01,
          clinvar: null,
          impact: ['HIGH', 'MODERATE'],
          consequence: null,
          inheritance: ['x-linked'],
          zyosity: null,
          minGenotypeDepth: null,
          minGenotypeAltCount: null,
          minRevel: null,
          exclusiveOf: ['pathogenic']
        },
        'high': {
          active: true,
          custom: false,
          title: "High or moderate impact",
          name: "High impact, low allele freq",
          order: 7,
          userFlagged: false,
          maxAf: .025,
          clinvar: null,
          impact: ['HIGH', 'MODERATE'],
          consequence: null,
          inheritance: null,
          zyosity: null,
          isUserFlagged: false,
          minGenotypeDepth: null,
          minGenotypeAltCount: null,
          minRevel: .4,
          exclusiveOf: ['pathogenic', 'autosomalDominant', 'recessive', 'denovo', 'compoundHet', 'xlinked']
        },
        'userFlagged': {
          active: true,
          custom: false,
          title: "Flagged by user",
          name: "Variants flagged by user",
          order: 8,
          userFlagged: true,
          maxAf: null,
          clinvar: null,
          impact: null,
          consequence: null,
          inheritance: null,
          zyosity: null,
          minGenotypeDepth: null,
          minGenotypeAltCount: null,
          minRevel: null,
          exclusiveOf:  null
        },
        'notCategorized': {
          // TODO - figure out how to show when variants no longer match filters
          active: false,
          custom: false,
          title: "Passes external filter",
          name: "Variants filtered in pre-processing, but not passing any app filters",
          order: 9,
          userFlagged: false,
          maxAf: null,
          clinvar: null,
          impact: null,
          consequence: null,
          inheritance: null,
          zyosity: null,
          minGenotypeDepth: null,
          minGenotypeAltCount: null,
          minRevel: null,
          exclusiveOf: null
        },
        'notCategorized': {
          // TODO - figure out how to show when variants no longer match filters
          active: false,
          custom: false,
          title: "Filtered variants",
          name: "Variants found during full analysis, but not passing any app filters",
          order: 8,
          userFlagged: false,
          maxAf: null,
          clinvar: null,
          impact: null,
          consequence: null,
          inheritance: null,
          zyosity: null,
          minGenotypeDepth: null,
          minGenotypeAltCount: null,
          minRevel: null,
          exclusiveOf: null
        },
        'notFound': {
          // TODO - figure out how to show when variants no longer match filters
          active: false,
          custom: false,
          title: "Not found",
          name: "Variants not found",
          order: 9,
          userFlagged: false,
          maxAf: null,
          clinvar: null,
          impact: null,
          consequence: null,
          inheritance: null,
          zyosity: null,
          minGenotypeDepth: null,
          minGenotypeAltCount: null,
          minRevel: null,
          exclusiveOf: null
        }


      },
      genefull: {
        'reviewed': {
          active: false,
          custom: false,
          title: "Reviewed",
          name: "Variants with notes and/or interpretation",
          order: 0,
          userFlagged: false,
          maxAf: null,
          clinvar: null,
          impact: null,
          consequence: null,
          inheritance: null,
          zyosity: null,
          minGenotypeDepth: null,
          minGenotypeAltCount: null,
          minRevel: null,
          exclusiveOf: null
        },
        'pathogenic': {
          active: true,
          custom: false,
          title: "Pathogenic in ClinVar",
          name: "Pathogenic, likely pathogenic ClinVar, low allele freq",
          order: 1,
          userFlagged: false,
          maxAf: .01,
          clinvar: ['clinvar_path', 'clinvar_lpath'],
          impact: null,
          consequence: null,
          inheritance: null,
          zyosity: null,
          minGenotypeDepth: null,
          minGenotypeAltCount: null,
          minRevel: null,
          exclusiveOf: null
        },
        'autosomalDominant': {
          active: true,
          custom: false,
          title: "Autosomal dominant",
          name: "Autosomal dominant inhertance, low allele freq",
          order: 2,
          userFlagged: false,
          maxAf: .01,
          clinvar: null,
          impact: ['HIGH', 'MODERATE'],
          consequence: null,
          inheritance: ['autosomal dominant'],
          zyosity: null,
          minGenotypeDepth: null,
          minGenotypeAltCount: null,
          minRevel: null,
          exclusiveOf: ['pathogenic']
        },
        'recessive': {
          active: true,
          custom: false,
          title:"Recessive",
          name: "Recessive inheritance, low allele freq",
          order: 3,
          userFlagged: false,
          maxAf: .01,
          clinvar: null,
          impact: ['HIGH', 'MODERATE'],
          consequence: null,
          inheritance: ['recessive'],
          zyosity: null,
          minGenotypeDepth: null,
          minGenotypeAltCount: 5,
          minRevel: null,
          isUserFlagged: false,
          exclusiveOf: ['pathogenic']
        },
        'denovo': {
          active: true,
          custom: false,
          title: "De novo",
          name: "De novo inheritance, low allele freq",
          order: 4,
          userFlagged: false,
          maxAf: .01,
          clinvar: null,
          impact: ['HIGH', 'MODERATE'],
          consequence: null,
          inheritance: ['denovo'],
          zyosity: null,
          minGenotypeDepth: null,
          minGenotypeAltCount: 5,
          minRevel: null,
          exclusiveOf: ['pathogenic']
        },
        'compoundHet': {
          active: true,
          custom: false,
          title: "Compound hets",
          name: "Compound het inheritance, low allele freq",
          order: 5,
          userFlagged: false,
          maxAf: .05,
          clinvar: null,
          impact: ['HIGH', 'MODERATE'],
          consequence: null,
          inheritance: ['compound het'],
          zyosity: null,
          minGenotypeDepth: null,
          minGenotypeAltCount: null,
          minRevel: null,
          exclusiveOf: ['pathogenic']
        },
        'xlinked': {
          active: true,
          custom: false,
          title: "X-linked recessive",
          name: "X-linked recessive inheritance, low allele freq",
          userFlagged: false,
          order: 6,
          maxAf: .01,
          clinvar: null,
          impact: ['HIGH', 'MODERATE'],
          consequence: null,
          inheritance: ['x-linked'],
          zyosity: null,
          minGenotypeDepth: null,
          minGenotypeAltCount: null,
          minRevel: null,
          exclusiveOf: ['pathogenic']
        },
        'high': {
          active: false,
          custom: false,
          title: "High impact",
          name: "High impact, low allele freq",
          order: 7,
          userFlagged: false,
          maxAf: .01,
          clinvar: null,
          impact: ['HIGH', ],
          consequence: null,
          inheritance: null,
          zyosity: null,
          isUserFlagged: false,
          minGenotypeDepth: null,
          minGenotypeAltCount: null,
          minRevel: .75,
          exclusiveOf: ['pathogenic', 'autosomalDominant', 'recessive', 'denovo', 'compoundHet', 'xlinked']
        },
        'notCategorized': {
          // TODO - figure out how to show when variants no longer match filters
          active: false,
          custom: false,
          title: "Filtered variants",
          name: "Variants found during full analysis, but not passing any app filters",
          order: 8,
          userFlagged: false,
          maxAf: null,
          clinvar: null,
          impact: null,
          consequence: null,
          inheritance: null,
          zyosity: null,
          minGenotypeDepth: null,
          minGenotypeAltCount: null,
          minRevel: null,
          exclusiveOf: null
        },
        'notFound': {
          // TODO - figure out how to show when variants no longer match filters
          active: false,
          custom: false,
          title: "Not found",
          name: "Variants not found",
          order: 9,
          userFlagged: false,
          maxAf: null,
          clinvar: null,
          impact: null,
          consequence: null,
          inheritance: null,
          zyosity: null,
          minGenotypeDepth: null,
          minGenotypeAltCount: null,
          minRevel: null,
          exclusiveOf: null
        }
      }
    }

    this.flagCriteria = this.isFullAnalysis ? this.flagCriterion.genefull : this.flagCriterion.gene;

    this.modelFilters = {
      'known-variants': {
        'clinvar': []
      },
      'sfari-variants': {
      'vepImpact': []
      }
    }
  }

  getSortedActiveFilters() {
    let self = this;
    let filters = [];
    for (var filterName in self.flagCriteria) {
      let flagCriteria = self.flagCriteria[filterName];
      if (flagCriteria.active) {
        filters.push($.extend({'key': filterName}, flagCriteria));
      }
    }

    let sortedFilters = filters.sort(function(filterObject1, filterObject2) {
      return filterObject1.order > filterObject2.order;
    })

    return sortedFilters;
  }


  getFilterObject() {
    let self = this;
    // For mygene2 basic mode, return a fixed filter of clinvar path / likely path and AF < 1%
    if (self.isBasicMode) {
      var annots =  {
        clinvar_path:     {key: 'clinvar',       state: true, value: 'clinvar_path'},
        clinvar_lpath:    {key: 'clinvar',       state: true, value: 'clinvar_lpath'}
      }

      return { afMin: 0, afMax: .01, annotsToInclude: annots };
    }

    var afMin = 0;
    var afMax = 1;
    var coverageMin = 0;

    return {
      'coverageMin': coverageMin,
      'afMin': afMin,
      'afMax': afMax,
      'annotsToInclude': this.annotsToInclude,
      'exonicOnly': $('#exonic-only-cb').is(":checked"),
      'loadedVariants': $('#loaded-variants-cb').is(":checked"),
      'calledVariants': $('#called-variants-cb').is(":checked"),
      'affectedInfo': self.getAffectedFilterInfo()
    };
  }


  populateEffectFilters(resultMap) {
    let self = this;
    for (var key in resultMap) {
      resultMap[key].features.forEach(function(variant) {
        if (variant.hasOwnProperty('effect')) {
          for (var effect in variant.effect) {
            self.snpEffEffects[effect] = effect;
          }
        }
        if (variant.hasOwnProperty('vepConsequence')) {
          for (var vepConsequence in variant.vepConsequence) {
            self.vepConsequences[vepConsequence] = vepConsequence;
          }
        }
      });
    }
  }

  populateRecFilters(resultMap) {
    let self = this;

    if (self.recFilters == null) {
      self.recFilters = {};
    }
    for (var key in resultMap) {
      resultMap[key].features.forEach( function(variant) {
        if (!variant.hasOwnProperty('fbCalled') || variant.fbCalled != 'Y') {
          self.recFilters[variant.recfilter] = variant.recfilter;
        }
      });
    }
  }


  hasFilters() {
    return this.getFilterString().length > 0;
  }

  getFilterString() {
    let self = this;

    var filterString = "";
    var filterObject = self.getFilterObject();


    var AND = function(filterString) {
      if (filterString.length > 0) {
        return   " <span class='filter-element'>and</span> ";
      } else {
        return "";
      }
    }

    var filterBox = function(filterString) {
      return "<span class=\"filter-flag filter-element label label-primary\">" + filterString + "</span>";
    }



    // When low coverage filter applied, we only filter on this, not any other criteria.
    if (this.applyLowCoverageFilter) {
      filterString += filterBox("Exon coverage min < " + this.geneCoverageMin + " OR median < " + this.geneCoverageMedian + " OR mean < " + this.geneCoverageMean);
      return filterString;
    }

    var affectedFilters = [];
    if (filterObject.affectedInfo) {
      affectedFilters = filterObject.affectedInfo.filter(function(info) {
        return info.filter && info.status == 'affected';
      });
      if (affectedFilters.length > 0) {
        var buf = "";
        affectedFilters.forEach(function(info) {
          if (buf.length > 0) {
            buf += ", ";
          }
          buf += info.label;
        })
        filterString +=  AND(filterString) + filterBox("Present in affected: " + buf);
      }
    }

    var unaffectedFilters = [];
    if (filterObject.affectedInfo) {
      unaffectedFilters = filterObject.affectedInfo.filter(function(info) {
        return info.filter  && info.status == 'unaffected';
      });
      if (unaffectedFilters.length > 0) {
        var buf = "";
        unaffectedFilters.forEach(function(info) {
          if (buf.length > 0) {
            buf += ", ";
          }
          buf += info.label;
        })
        filterString +=  AND(filterString) +  filterBox("Absent in unaffected: " + buf);
      }
    }



//    if ($('#exonic-only-cb').is(":checked")) {
//      filterString += AND(filterString) + filterBox("not intronic");
//    }

    if (filterObject.afMin != null && filterObject.afMax != null) {
      if (filterObject.afMin >= 0 && filterObject.afMax < 1) {
        filterString += AND(filterString) + filterBox("Allele freqency between " + filterObject.afMin + " and  " + filterObject.afMax);
      }
    }

    if (filterObject.coverageMin && filterObject.coverageMin > 0) {
      if (filterString.length > 0) {
        filterString += AND(filterString) +  filterBox("coverage at least " + filterObject.coverageMin + "X");
      }
    }


    var annots = {};
    for (var key in filterObject.annotsToInclude) {
      var annot = filterObject.annotsToInclude[key];
      if (annot.state) {
        var annotObject = annots[annot.key];
        if (annotObject == null) {
          annotObject = {values: [], label: annot.label};
          annots[annot.key] = annotObject;
        }
        annotObject.values.push((annot.not ? "NOT " : "") + annot.valueDisplay);
      }
    }

    for (var key in annots) {
      var annotObject = annots[key];
      var theValues = "";
      annotObject.values.forEach(function(theValue) {
        if (theValues.length > 0) {
          theValues += ", "
        } else if (annotObject.values.length > 1) {
          theValues +=  "(";
        }
        theValues += theValue;
      });
      if (annotObject.values.length > 1) {
        theValues += ")";
      }

      filterString += AND(filterString) + filterBox(annotObject.label + '&nbsp;&nbsp;' + theValues);
    }
    return filterString;
  }



  passesModelFilter(relationship, variant) {
    let self = this;
    let theFilters = self.modelFilters[relationship];
    if (theFilters) {
      let passCount = 0;
      for (var key in theFilters) {
        let filterEntries = theFilters[key];
        if (filterEntries && filterEntries.length > 0) {
          let varKey = variant[key];
          if (relationship === 'sfari-variants' && Object.keys(varKey)) {
            varKey = Object.values(varKey)[0];
          }
          if (filterEntries.indexOf(varKey) >= 0) {
            passCount++;
          }
        } else {
          passCount++;
        }
      }
      return passCount == Object.keys(theFilters).length;
    } else {
      return true;
    }
  }

  setModelFilter(relationship, key, entries) {
    this.modelFilters[relationship][key] = entries;
  }



  whichLowCoverage(gc) {
    var fields = {};
    fields.min    = +gc.min    < this.geneCoverageMin    ? '< ' + this.geneCoverageMin : null;
    fields.median = +gc.median < this.geneCoverageMedian ? '< ' + this.geneCoverageMedian : null;
    fields.mean   = +gc.mean   < this.geneCoverageMean   ? '< ' + this.geneCoverageMean : null;
    return fields;
  }

  isLowCoverage(gc) {
    return  +gc.min   < this.geneCoverageMin
    || +gc.median < this.geneCoverageMedian
    || +gc.mean   < this.geneCoverageMean;
  }

  getAffectedFilterInfo(refreshedAffectedInfo) {
    var self = this;

    if (refreshedAffectedInfo) {
      self.affectedInfo = refreshedAffectedInfo;
    }

    if (refreshedAffectedInfo) {
      self.affectedInfo.filter(function(info) {
        return info.model.isAffected();
      })
      .forEach(function(info) {
        //var cb = $('#present-in-affected').find("#" + info.id + " input");
        //info.filter = (cb.is(":checked"));
      });

      self.affectedInfo.filter(function(info) {
        return !info.model.isAffected();
      })
      .forEach(function(info) {
        //var cb = $('#absent-in-unaffected').find("#" + info.id + " input");
        //info.filter = (cb.is(":checked"));
      });

    }
    return this.affectedInfo;
  }


  clearAffectedFilters() {
    let self = this;

    if (self.affectedInfo) {
      self.affectedInfo.filter(function(info) {
        return info.model.isAffected() && info.relationship != 'proband';
      })
      .forEach(function(info) {
        //var cb = $('#present-in-affected').find("#" + info.id + " input");
        //cb.prop('checked', false);
        info.filter = false;
      });

      self.affectedInfo.filter(function(info) {
        return !info.model.isAffected();
      })
      .forEach(function(info) {
        //var cb = $('#absent-in-unaffected').find("#" + info.id + " input");
        //cb.prop('checked', false);
        info.filter = false;
      });


      //self.affectedInfo = getAffectedInfo();
    }

    return self.affectedInfo;
  }

  flagVariants(theVcfData) {
    let self = this;
    var badges = {};
    for (var key in this.flagCriteria) {
      if (this.flagCriteria[key].active) {
        badges[key] = [];
      }
    }
    badges.flagged = [];

    if (theVcfData && theVcfData.features) {
      theVcfData.features.filter(function(variant) {
        return variant.zygosity == null || variant.zygosity.toUpperCase() != 'HOMREF';
      })
      .forEach(function(variant) {
        self._flagVariant(variant, badges);
      })

    }
    return badges;

  }

  flagImportedVariants(importedVariants) {
    let self = this;
    var badges = {};
    for (var key in this.flagCriteria) {
      if (this.flagCriteria[key].active) {
        badges[key] = [];
      }
    }
    badges.flagged = [];

    importedVariants.forEach(function(variant) {
      self._flagVariant(variant, badges);
    })

    return badges;
  }

  _flagVariant(variant, badges) {
    let self = this;
    var badgePassState = {};

    for (var key in self.flagCriteria) {
      if (self.flagCriteria[key].active) {
        badgePassState[key] = false;
      }
    }
    badgePassState.flagged = false;

    if (variant.notFound) {
      badgePassState['notFound'] = true;
    } else if (variant.isUserFlagged) {
      badgePassState['userFlagged'] = true;
    } else {
      variant.isFlagged = false;
      variant.featureClass = "";
      for (var badge in self.flagCriteria) {
        if (self.flagCriteria[badge].active) {

          var passes = self.determinePassCriteria(badge, variant);

          if (passes.all) {
            badgePassState[badge] = true;
          }
        }
      }

      var filtersPassedAll = [];
      for (var filterName in self.flagCriteria) {
        if (badgePassState[filterName]) {
          filtersPassedAll.push(filterName);
        }
      }
      // If a badge is exclusive of passing other criteria, fail the badge
      // if the other badges passed the criteria for the filter
      // Example:  high is exclusive of the clinvar badge.
      //           So if the variant passes the clinvar criteria, it does
      //           not pass the high criteria.
      for (var badge in self.flagCriteria) {
        var badgeCriteria = self.flagCriteria[badge];
        if (badgeCriteria.exclusiveOf) {
          var matchesOther = false;
          badgeCriteria.exclusiveOf.forEach(function(exclusiveBadge) {
            if (badgePassState[exclusiveBadge]) {
              matchesOther = true;
            }
          })
          if (matchesOther) {
            badgePassState[badge] = false;
          }
        }
      }
    }

    // Now add the variant to any badges that passes the critera
    var filtersPassed = [];
    for (var filterName in self.flagCriteria) {
      if (badgePassState[filterName]) {
          filtersPassed.push(filterName);
          badges[filterName].push(variant);
      }
    }
    if (filtersPassed.length > 0) {
      variant.isFlagged = true;
      variant.featureClass = 'flagged';
      variant.filtersPassed = filtersPassed;
      variant.filtersPassedAll = filtersPassedAll;
    } else if (variant.isImported) {
      variant.isFlagged = true;
      variant.isUserFlagged = false;
      variant.notCategorized = true;
      variant.featureClass = 'flagged';
      self.mapGenomeWideFilter(variant);
      if (badges["notCategorized"] == null) {
        badges["notCategorized"] = [];
      }
      badges["notCategorized"].push(variant)
    }

    if (variant.isFlagged) {
      if (!variant.analysisMode) {
        variant.analysisMode = {gene: false, genefull: false};
      }
      if (self.isFullAnalysis) {
        variant.analysisMode.genefull = true;
      } else {
        variant.analysisMode.gene = true;
      }

      badges.flagged.push(variant);
    }

  }

  mapGenomeWideFilter(variant) {
    let self = this;
    if (variant.variantSet && variant.variantSet.length > 0) {
      let filter = self.flagCriteria[variant.variantSet];
      if (filter) {
        variant.filtersPassed = variant.variantSet;
      } else {
        variant.filtersPassed = 'notCategorized';
      }
    } else {
      variant.filtersPassed = "notCategorized";
    }
  }

  determinePassCriteria(badge, variant, options) {
    let self = this;
    var badgeCriteria = self.flagCriteria[badge];
    var passes = {
      all: false,
      af: false,
      impact: false,
      consequence: false,
      clinvar: false,
      inheritance: false,
      zygosity: false,
      depth: false,
      altCount: false,
      revel: false,
      userFlagged: false,
      notCategorized: false,
      notFound: false
    };

    if (badge == 'notCategorized') {
      if (variant.notCategorized) {
        passes.notCategorized = true;
        passes.all = true;
      }
    } else if (badge == 'notFound') {
      if (variant.notFound) {
        passes.notFound = true;
        passes.all = true;
      }
    } else if (badgeCriteria.userFlagged == true) {
      if (variant.isUserFlagged) {
        passes.userFlagged = true;
        passes.all = true;
      }
    } else {
      if (badgeCriteria.maxAf == null || (variant.afHighest <= badgeCriteria.maxAf)) {
        passes.af = true;
      }
      if (badgeCriteria.minRevel == null || badgeCriteria.minRevel == "") {
        passes.revel = true;
      } else if (Object.keys(variant.vepREVEL).length == 0) {
        // This isn't a variant with a REVEL score, so don't try to filter
        passes.revel = true
      } else {
        // This is a variant with a revel score, so make sure it passes
        // the min revel score (if non-blank)
        for (var revel in variant.vepREVEL) {
          if (revel == "" || +revel >= badgeCriteria.minRevel) {
            passes.revel = true;
          }
        }
      }
      if (badgeCriteria.minGenotypeDepth == null || badgeCriteria.minGenotypeDepth == ""  || (+variant.genotypeDepth >= +badgeCriteria.minGenotypeDepth)) {
        passes.depth = true;
      }
      if (badgeCriteria.minGenotypeAltCount == null || badgeCriteria.minGenotypeAltCount == "" ||( +variant.genotypeAltCount >= +badgeCriteria.minGenotypeAltCount)) {
        passes.altCount = true;
      }
      if (badgeCriteria.impact && badgeCriteria.impact.length > 0) {
        badgeCriteria.impact.forEach(function(key) {
          Object.keys(variant.highestImpactVep).forEach(function(highestImpactKey) {
            if (highestImpactKey == key) {
              passes.impact = true;
            }
          })
        })
      } else {
        passes.impact = true;
      }
      if (badgeCriteria.consequence && badgeCriteria.consequence.length > 0) {
        badgeCriteria.consequence.forEach(function(key) {
          if (Object.keys(variant.vepConsequence).indexOf(key) >= 0) {
            passes.consequence = true;
          }
        })
      } else {
        passes.consequence = true;
      }
      if (badgeCriteria.clinvar == null || badgeCriteria.clinvar.length == 0 || badgeCriteria.clinvar.indexOf(variant.clinvar) >= 0) {
        passes.clinvar = true;
      }
      if (badgeCriteria.inheritance == null || badgeCriteria.inheritance.length == 0 || badgeCriteria.inheritance.indexOf(variant.inheritance) >= 0) {
        passes.inheritance = true;
      }
      if (badgeCriteria.zygosity == null || variant.zygosity.toUpperCase() == badgeCriteria.zygosity.toUpperCase() ) {
        passes.zygosity = true;
      }
      if (options && options.ignore) {
        options.ignore.forEach(function(criterion) {
          passes[criterion] = true;
        })
      }
      if (passes.af && passes.revel && passes.depth && passes.altCount && passes.impact && passes.consequence && passes.clinvar && passes.inheritance && passes.zygosity) {
        passes.all = true;
      }
    }

    return passes;
  }


}

export default FilterModel;
