import { beautifyAttribute, beautifyReportItems, categoryNames, categoryOrder, categoryTitles, combinationNames, combinationOrder, criteriaNames, ReportFormat } from './reportDefinitions'

export function getCategoryTitle (name = '') {
  return beautifyAttribute(name, categoryTitles)
}

export function getCombinationTitle (name = '') {
  return beautifyAttribute(name, combinationNames)
}

export function getCriteriaTitle (name = '') {
  return beautifyAttribute(name, criteriaNames)
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
