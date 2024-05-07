import { omit, orderBy } from 'lodash-es'
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

export function beautifyCategoryPointFlat (input: CategoryPointDetails): ReportItemFormat[] {
  const beautifiedPoints = beautifyCategoryPoint(input)
  const flatPoints = flattenReportFormat(beautifiedPoints)
  const orderedPoints = orderBy(flatPoints, ['slotNumber', 'performerName', 'discipline'], ['desc', 'asc', 'asc'])
  return orderedPoints.map((item) => omit(item, ['Kategorie']))
}

export function flattenReportFormat (reportFormat: ReportFormat) {
  const reportItemsFormat: ReportItemFormat[] = []
  Object.entries(reportFormat).forEach(([reportKey, reportItems]) => {
    reportItems.forEach(reportItem => {
      reportItemsFormat.push({
        Titel: reportKey,
        ...reportItem
      } as unknown as ReportItemFormat)
    })
  })
  return reportItemsFormat
}

export function beautifyCategoryPoint (input: CategoryPointDetails): ReportFormat {
  if (!input || Object.keys(input).length === 0) {
    return {}
  }
  const entries = Object.entries(input)
    .map(([categoryName, categoryPoints]) => {
      const reportItems = categoryPointToReport(categoryName, categoryPoints)
      return [getCategoryTitle(categoryName), beautifyReportItems(categoryName, reportItems, categoryOrder, categoryNames, true)] as [string, ReportItemFormat[]]
    })
    .sort(keySort)
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
          locationName: categoryPoint.locationName || '',
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
  const entries = Object.entries(input)
    .map(([categoryName, categoryRanks]) => {
      return [getCategoryTitle(categoryName), beautifyReportItems(categoryName, categoryRanks, categoryOrder, categoryNames)] as [string, ReportItemFormat[]]
    })
    .sort(keySort)
  return Object.fromEntries(entries)
}

export function beautifyCombinationRank (input: ReportFormat): ReportFormat {
  if (!input || Object.keys(input).length === 0) {
    return input
  }
  const entries = Object.entries(input)
    .map(([combinationName, combinationRanks]) => {
      return [getCombinationTitle(combinationName), beautifyReportItems(combinationName, combinationRanks, combinationOrder, combinationNames)] as [string, ReportItemFormat[]]
    })
    .sort(keySort)
  return Object.fromEntries(entries)
}

type NullableKey = string | number | null | undefined
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Entry = [NullableKey, ...any]
export function keySort (a: Entry, b: Entry) {
  return lexicograficSort(a[0], b[0])
}

export function keySortDesc (a: Entry, b: Entry) {
  return lexicograficSort(a[0], b[0], true)
}

export function lexicograficSort (a: NullableKey, b: NullableKey, desc?: boolean) {
  if (!a && !b) {
    return 0
  }
  if (!a) {
    return desc ? 1 : -1
  }
  if (!b) {
    return desc ? -1 : 1
  }
  if (typeof a === 'number' && typeof b === 'number') {
    return (a - b) * (desc ? -1 : 1)
  }
  return ((String(a)).localeCompare(String(b)) * (desc ? -1 : 1))
}
