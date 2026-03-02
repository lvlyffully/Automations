// Shared store for managing stickiness references between leads and opportunities

export interface StickinessRule {
  id: string
  name: string
  opportunityListId: string
  opportunityListName: string
  stickyFields: string[]
  conflictResolution: "recent" | "earliest"
  isActive: boolean
  createdAt: string
}

export interface Opportunity {
  id: string
  listId: string
  listName: string
  leadId: string
  leadName: string
  createdAt: string
  createdBy: string
  owner: string
  fieldValues: Record<string, string> // Maps field name to field value (e.g., {"Exam Category": "UPSC", "Course ID": "123"})
}

export interface LeadStickinessReference {
  [opportunityListName: string]: {
    [fieldValue: string]: string | null // Maps field value to opportunity ID
  }
}

const STICKINESS_RULES_KEY = "stickinessRules"
const OPPORTUNITIES_KEY = "opportunities"
const LEAD_STICKINESS_KEY = "leadStickinessReferences"

const SAMPLE_EXAM_CATEGORY_RULE: StickinessRule = {
  id: "sample-exam-category",
  name: "Exam Category Stickiness Rule",
  opportunityListId: "exam-category-sample",
  opportunityListName: "Exam Category",
  stickyFields: ["Exam Category"],
  conflictResolution: "recent",
  isActive: true,
  createdAt: "2025-12-17T17:30:00.000Z",
}

const SAMPLE_UG_PG_RULE: StickinessRule = {
  id: "sample-ug-pg",
  name: "UG & PG Program Type Stickiness Rule",
  opportunityListId: "ug-pg-sample",
  opportunityListName: "UG & PG Opportunity",
  stickyFields: ["Program Type"],
  conflictResolution: "earliest",
  isActive: true,
  createdAt: "2025-12-17T18:00:00.000Z",
}

const SAMPLE_CERTIFICATE_RULE: StickinessRule = {
  id: "sample-certificate",
  name: "Certificate Stickiness Rule",
  opportunityListId: "certificate-sample",
  opportunityListName: "Certificate Opportunity",
  stickyFields: ["Certificate Type", "Duration"],
  conflictResolution: "recent",
  isActive: true,
  createdAt: "2025-12-17T18:30:00.000Z",
}

const SAMPLE_OPPORTUNITIES: Opportunity[] = [
  {
    id: "OPP-1001",
    listId: "exam-category-sample",
    listName: "Exam Category",
    leadId: "lead-1",
    leadName: "bnjhphlj",
    createdAt: "2025-12-01T10:00:00.000Z",
    createdBy: "System",
    owner: "Sales Team A",
    fieldValues: {
      "Exam Category": "UPSC",
      "Course ID": "101",
    },
  },
  {
    id: "OPP-1002",
    listId: "exam-category-sample",
    listName: "Exam Category",
    leadId: "lead-1",
    leadName: "bnjhphlj",
    createdAt: "2025-12-03T11:00:00.000Z",
    createdBy: "System",
    owner: "Sales Team B",
    fieldValues: {
      "Exam Category": "UPSC",
      "Course ID": "102",
    },
  },
  {
    id: "OPP-1003",
    listId: "exam-category-sample",
    listName: "Exam Category",
    leadId: "lead-1",
    leadName: "bnjhphlj",
    createdAt: "2025-12-05T12:00:00.000Z",
    createdBy: "System",
    owner: "Sales Team C",
    fieldValues: {
      "Exam Category": "PSC",
      "Course ID": "201",
    },
  },
  {
    id: "OPP-1004",
    listId: "exam-category-sample",
    listName: "Exam Category",
    leadId: "lead-2",
    leadName: "Bethel",
    createdAt: "2025-12-07T14:00:00.000Z",
    createdBy: "System",
    owner: "Sales Team A",
    fieldValues: {
      "Exam Category": "Banking",
      "Course ID": "301",
    },
  },
  {
    id: "OPP-1005",
    listId: "exam-category-sample",
    listName: "Exam Category",
    leadId: "lead-2",
    leadName: "Bethel",
    createdAt: "2025-12-09T15:00:00.000Z",
    createdBy: "System",
    owner: "Sales Team D",
    fieldValues: {
      "Exam Category": "Banking",
      "Course ID": "302",
    },
  },
  {
    id: "OPP-1006",
    listId: "exam-category-sample",
    listName: "Exam Category",
    leadId: "lead-3",
    leadName: "Daniel",
    createdAt: "2025-12-10T16:00:00.000Z",
    createdBy: "System",
    owner: "Sales Team B",
    fieldValues: {
      "Exam Category": "UPSC",
      "Course ID": "103",
    },
  },
  {
    id: "OPP-1007",
    listId: "exam-category-sample",
    listName: "Exam Category",
    leadId: "lead-4",
    leadName: "Tony",
    createdAt: "2025-12-11T17:00:00.000Z",
    createdBy: "System",
    owner: "Sales Team C",
    fieldValues: {
      "Exam Category": "Railway",
      "Course ID": "401",
    },
  },
  {
    id: "OPP-2001",
    listId: "ug-pg-sample",
    listName: "UG & PG Opportunity",
    leadId: "lead-5",
    leadName: "Gertrude",
    createdAt: "2025-12-12T09:00:00.000Z",
    createdBy: "System",
    owner: "Academic Team A",
    fieldValues: {
      "Program Type": "UG",
      Course: "Engineering",
    },
  },
  {
    id: "OPP-2002",
    listId: "ug-pg-sample",
    listName: "UG & PG Opportunity",
    leadId: "lead-5",
    leadName: "Gertrude",
    createdAt: "2025-12-13T10:00:00.000Z",
    createdBy: "System",
    owner: "Academic Team B",
    fieldValues: {
      "Program Type": "UG",
      Course: "Medicine",
    },
  },
  {
    id: "OPP-2003",
    listId: "ug-pg-sample",
    listName: "UG & PG Opportunity",
    leadId: "lead-5",
    leadName: "Gertrude",
    createdAt: "2025-12-14T11:00:00.000Z",
    createdBy: "System",
    owner: "Academic Team C",
    fieldValues: {
      "Program Type": "PG",
      Course: "MBA",
    },
  },
  {
    id: "OPP-2004",
    listId: "ug-pg-sample",
    listName: "UG & PG Opportunity",
    leadId: "lead-5",
    leadName: "Gertrude",
    createdAt: "2025-12-15T12:00:00.000Z",
    createdBy: "System",
    owner: "Academic Team D",
    fieldValues: {
      "Program Type": "PG",
      Course: "Masters",
    },
  },
  {
    id: "OPP-2005",
    listId: "ug-pg-sample",
    listName: "UG & PG Opportunity",
    leadId: "lead-5",
    leadName: "Gertrude",
    createdAt: "2025-12-16T13:00:00.000Z",
    createdBy: "System",
    owner: "Academic Team E",
    fieldValues: {
      "Program Type": "UG",
      Course: "Science",
    },
  },
  {
    id: "OPP-3001",
    listId: "certificate-sample",
    listName: "Certificate Opportunity",
    leadId: "lead-6",
    leadName: "Vassilisa Israel",
    createdAt: "2025-12-17T09:00:00.000Z",
    createdBy: "System",
    owner: "Certificate Team A",
    fieldValues: {
      "Certificate Type": "Data Science",
      Duration: "6 months",
    },
  },
  {
    id: "OPP-3002",
    listId: "certificate-sample",
    listName: "Certificate Opportunity",
    leadId: "lead-6",
    leadName: "Vassilisa Israel",
    createdAt: "2025-12-17T10:00:00.000Z",
    createdBy: "System",
    owner: "Certificate Team B",
    fieldValues: {
      "Certificate Type": "Data Science",
      Duration: "12 months",
    },
  },
  {
    id: "OPP-3003",
    listId: "certificate-sample",
    listName: "Certificate Opportunity",
    leadId: "lead-6",
    leadName: "Vassilisa Israel",
    createdAt: "2025-12-17T11:00:00.000Z",
    createdBy: "System",
    owner: "Certificate Team C",
    fieldValues: {
      "Certificate Type": "Data Science",
      Duration: "6 months",
    },
  },
  {
    id: "OPP-3004",
    listId: "certificate-sample",
    listName: "Certificate Opportunity",
    leadId: "lead-6",
    leadName: "Vassilisa Israel",
    createdAt: "2025-12-17T12:00:00.000Z",
    createdBy: "System",
    owner: "Certificate Team D",
    fieldValues: {
      "Certificate Type": "AI/ML",
      Duration: "6 months",
    },
  },
  {
    id: "OPP-1008",
    listId: "exam-category-sample",
    listName: "Exam Category",
    leadId: "lead-7",
    leadName: "Philemon",
    createdAt: "2025-12-18T09:00:00.000Z",
    createdBy: "System",
    owner: "Sales Team A",
    fieldValues: {
      "Exam Category": "UPSC",
      "Course ID": "104",
    },
  },
  {
    id: "OPP-1009",
    listId: "exam-category-sample",
    listName: "Exam Category",
    leadId: "lead-7",
    leadName: "Philemon",
    createdAt: "2025-12-18T10:00:00.000Z",
    createdBy: "System",
    owner: "Sales Team B",
    fieldValues: {
      "Exam Category": "UPSC",
      "Course ID": "105",
    },
  },
  {
    id: "OPP-2006",
    listId: "ug-pg-sample",
    listName: "UG & PG Opportunity",
    leadId: "lead-7",
    leadName: "Philemon",
    createdAt: "2025-12-18T11:00:00.000Z",
    createdBy: "System",
    owner: "Academic Team A",
    fieldValues: {
      "Program Type": "UG",
      Course: "Law",
    },
  },
  {
    id: "OPP-2007",
    listId: "ug-pg-sample",
    listName: "UG & PG Opportunity",
    leadId: "lead-7",
    leadName: "Philemon",
    createdAt: "2025-12-18T12:00:00.000Z",
    createdBy: "System",
    owner: "Academic Team B",
    fieldValues: {
      "Program Type": "UG",
      Course: "Commerce",
    },
  },
  {
    id: "OPP-3005",
    listId: "certificate-sample",
    listName: "Certificate Opportunity",
    leadId: "lead-7",
    leadName: "Philemon",
    createdAt: "2025-12-18T13:00:00.000Z",
    createdBy: "System",
    owner: "Certificate Team A",
    fieldValues: {
      "Certificate Type": "Blockchain",
      Duration: "3 months",
    },
  },
  {
    id: "OPP-3006",
    listId: "certificate-sample",
    listName: "Certificate Opportunity",
    leadId: "lead-7",
    leadName: "Philemon",
    createdAt: "2025-12-18T14:00:00.000Z",
    createdBy: "System",
    owner: "Certificate Team B",
    fieldValues: {
      "Certificate Type": "Blockchain",
      Duration: "3 months",
    },
  },
  {
    id: "OPP-3007",
    listId: "certificate-sample",
    listName: "Certificate Opportunity",
    leadId: "lead-7",
    leadName: "Philemon",
    createdAt: "2025-12-18T15:00:00.000Z",
    createdBy: "System",
    owner: "Certificate Team C",
    fieldValues: {
      "Certificate Type": "Blockchain",
      Duration: "6 months",
    },
  },
]

const SAMPLE_STICKINESS_REFERENCES: Record<string, LeadStickinessReference> = {
  "lead-1": {
    "Exam Category": {
      UPSC: "OPP-1002",
      PSC: "OPP-1003",
    },
  },
  "lead-2": {
    "Exam Category": {
      Banking: "OPP-1005",
    },
  },
  "lead-3": {
    "Exam Category": {
      UPSC: "OPP-1006",
    },
  },
  "lead-4": {
    "Exam Category": {
      Railway: "OPP-1007",
    },
  },
  "lead-5": {
    "UG & PG Opportunity": {
      UG: "OPP-2001",
      PG: "OPP-2003",
    },
  },
  "lead-6": {
    "Certificate Opportunity": {
      "Data Science|6 months": "OPP-3003",
      "Data Science|12 months": "OPP-3002",
      "AI/ML|6 months": "OPP-3004",
    },
  },
  "lead-7": {
    "Exam Category": {
      UPSC: "OPP-1009",
    },
    "UG & PG Opportunity": {
      UG: "OPP-2006",
    },
    "Certificate Opportunity": {
      "Blockchain|3 months": "OPP-3006",
      "Blockchain|6 months": "OPP-3007",
    },
  },
}

export function getStickinessRules(): StickinessRule[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(STICKINESS_RULES_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      const hasExamCategoryRule = parsed.some(
        (r: StickinessRule) => r.id === "sample-exam-category" || r.opportunityListName === "Exam Category",
      )
      const hasUGPGRule = parsed.some(
        (r: StickinessRule) => r.id === "sample-ug-pg" || r.opportunityListName === "UG & PG Opportunity",
      )
      const hasCertificateRule = parsed.some(
        (r: StickinessRule) => r.id === "sample-certificate" || r.opportunityListName === "Certificate Opportunity",
      )

      const rulesToAdd = []
      if (!hasExamCategoryRule) rulesToAdd.push(SAMPLE_EXAM_CATEGORY_RULE)
      if (!hasUGPGRule) rulesToAdd.push(SAMPLE_UG_PG_RULE)
      if (!hasCertificateRule) rulesToAdd.push(SAMPLE_CERTIFICATE_RULE)

      if (rulesToAdd.length > 0) {
        const updated = [...parsed, ...rulesToAdd]
        localStorage.setItem(STICKINESS_RULES_KEY, JSON.stringify(updated))
        return updated
      }
      return parsed
    } else {
      const initialRules = [SAMPLE_EXAM_CATEGORY_RULE, SAMPLE_UG_PG_RULE, SAMPLE_CERTIFICATE_RULE]
      localStorage.setItem(STICKINESS_RULES_KEY, JSON.stringify(initialRules))
      return initialRules
    }
  } catch (e) {
    console.error("Error reading stickiness rules:", e)
    return []
  }
}

export function getOpportunities(): Opportunity[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(OPPORTUNITIES_KEY)
    if (stored) {
      return JSON.parse(stored)
    } else {
      localStorage.setItem(OPPORTUNITIES_KEY, JSON.stringify(SAMPLE_OPPORTUNITIES))
      return SAMPLE_OPPORTUNITIES
    }
  } catch (e) {
    console.error("Error reading opportunities:", e)
    return []
  }
}

export function saveOpportunities(opportunities: Opportunity[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(OPPORTUNITIES_KEY, JSON.stringify(opportunities))
  } catch (e) {
    console.error("Error saving opportunities:", e)
  }
}

export function getLeadStickinessReferences(): Record<string, LeadStickinessReference> {
  if (typeof window === "undefined") return {}

  try {
    const stored = localStorage.getItem(LEAD_STICKINESS_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)

      // Merge in any missing sample data
      let hasChanges = false
      for (const [leadId, reference] of Object.entries(SAMPLE_STICKINESS_REFERENCES)) {
        if (!parsed[leadId]) {
          parsed[leadId] = reference
          hasChanges = true
        }
      }

      if (hasChanges) {
        localStorage.setItem(LEAD_STICKINESS_KEY, JSON.stringify(parsed))
      }

      return parsed
    } else {
      localStorage.setItem(LEAD_STICKINESS_KEY, JSON.stringify(SAMPLE_STICKINESS_REFERENCES))
      return SAMPLE_STICKINESS_REFERENCES
    }
  } catch (e) {
    console.error("Error reading lead stickiness references:", e)
    return {}
  }
}

export function saveLeadStickinessReferences(references: Record<string, LeadStickinessReference>): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(LEAD_STICKINESS_KEY, JSON.stringify(references))
  } catch (e) {
    console.error("Error saving lead stickiness references:", e)
  }
}

export function updateStickinessReferenceOnOpportunityCreate(
  leadId: string,
  opportunityListName: string,
  newOpportunityId: string,
  fieldValues: Record<string, string>,
): void {
  const rules = getStickinessRules()
  const rule = rules.find((r) => r.opportunityListName === opportunityListName && r.isActive)

  if (!rule) {
    console.log(`[v0] No active stickiness rule found for list: ${opportunityListName}`)
    return
  }

  const stickyFieldValues = rule.stickyFields.map((field) => fieldValues[field]).filter(Boolean)

  if (stickyFieldValues.length !== rule.stickyFields.length) {
    console.log(`[v0] Not all sticky fields found in opportunity field values`)
    return
  }

  const compositeKey = stickyFieldValues.join("|")

  const opportunities = getOpportunities()
  const matchingOpportunities = opportunities
    .filter((opp) => {
      if (opp.listName !== opportunityListName || opp.leadId !== leadId) return false

      const oppCompositeKey = rule.stickyFields
        .map((field) => opp.fieldValues[field])
        .filter(Boolean)
        .join("|")

      return oppCompositeKey === compositeKey
    })
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

  let referenceOpportunityId: string | null = null

  if (rule.conflictResolution === "earliest") {
    referenceOpportunityId = matchingOpportunities[0]?.id || null
  } else if (rule.conflictResolution === "recent") {
    const currentIndex = matchingOpportunities.findIndex((opp) => opp.id === newOpportunityId)
    if (currentIndex > 0) {
      referenceOpportunityId = matchingOpportunities[currentIndex - 1].id
    } else {
      referenceOpportunityId = newOpportunityId
    }
  }

  const references = getLeadStickinessReferences()
  if (!references[leadId]) {
    references[leadId] = {}
  }
  if (!references[leadId][opportunityListName]) {
    references[leadId][opportunityListName] = {}
  }
  references[leadId][opportunityListName][compositeKey] = referenceOpportunityId
  saveLeadStickinessReferences(references)

  console.log(
    `[v0] Updated stickiness reference for lead ${leadId}: ${opportunityListName}[${compositeKey}] -> ${referenceOpportunityId ? `Opp #${referenceOpportunityId}` : "null"}`,
  )
}

export function addOpportunity(opportunity: Opportunity): void {
  const opportunities = getOpportunities()
  opportunities.push(opportunity)
  saveOpportunities(opportunities)

  updateStickinessReferenceOnOpportunityCreate(
    opportunity.leadId,
    opportunity.listName,
    opportunity.id,
    opportunity.fieldValues,
  )
}
