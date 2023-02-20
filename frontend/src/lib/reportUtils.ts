import { CategoryPointDetail, CategoryPointDetails } from '../contexts/ApiContextInterface'
import { beautifyAttribute, beautifyReportItems, categoryNames, categoryOrder, categoryTitles, combinationNames, combinationOrder, criteriaNames, ReportFormat, ReportItemFormat } from './reportDefinitions'

export function getCategoryTitle (name = '') {
  return beautifyAttribute(name, categoryTitles)
}

export function getCombinationTitle (name = '') {
  return beautifyAttribute(name, combinationNames)
}

export function getCriteriaTitle (name = '') {
  return beautifyAttribute(name, criteriaNames)
}

export function beautifyCategoryPoint (input: CategoryPointDetails): ReportFormat {
  if (!input || Object.keys(input).length === 0) {
    return {}
  }
  const entries = Object.entries(input).map(([categoryName, categoryPoints]) => {
    const reportItems = categoryPointToReport(categoryName, categoryPoints)
    return [getCategoryTitle(categoryName), beautifyReportItems(categoryName, reportItems, categoryOrder, categoryNames, true)]
  })
  return Object.fromEntries(entries)
}

export function categoryPointToReport (categoryName: string, categoryPoints: CategoryPointDetail[]) : ReportItemFormat[] {
  const items: ReportItemFormat[] = []
  for (const categoryPoint of categoryPoints) {
    Object.entries(categoryPoint.criteriaPoints).forEach(([criteriaName, judges]) => {
      judges.judges.forEach(judge => {
        const subCriteriaValues = Object.values(judge.subCriteriaPoints).reduce((memo, subCriteria) => {
          memo[subCriteria.subCriteriaName] = subCriteria.value || 0
          return memo
        }, {} as ReportItemFormat)

        return items.push({
          categoryName,
          criteriaName,
          performerNumber: categoryPoint.performerNumber || '',
          performerName: categoryPoint.performerName || '',
          performanceName: categoryPoint.performanceName || '',
          slotNumber: categoryPoint.slotNumber || '',
          clubName: categoryPoint.clubName || '',
          categoryPoint: categoryPoint.categoryPoint || 0,
          judgeId: judge.judgeId,
          judgeName: judge.judgeName,
          ...subCriteriaValues
        })
      })
    })
  }
  return items
}

export function beautifyCategoryRank (input: ReportFormat): ReportFormat {
  if (!input || Object.keys(input).length === 0) {
    return input
  }
  const entries = Object.entries(input).map(([categoryName, categoryRanks]) => {
    return [getCategoryTitle(categoryName), beautifyReportItems(categoryName, categoryRanks, categoryOrder, categoryNames)]
  })
  return Object.fromEntries(entries)
}

export function beautifyCombinationRank (input: ReportFormat): ReportFormat {
  if (!input || Object.keys(input).length === 0) {
    return input
  }
  const entries = Object.entries(input).map(([combinationName, combinationRanks]) => {
    return [getCombinationTitle(combinationName), beautifyReportItems(combinationName, combinationRanks, combinationOrder, combinationNames)]
  })
  return Object.fromEntries(entries)
}
