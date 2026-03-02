// Shared store for Opportunity Lists data
// This allows the opportunity playground data to be used in stickiness rules

export interface OpportunityField {
  id: string
  displayName: string
  fieldKey: string
  fieldType: string
  fieldTypeIcon: string
  properties?: string
  required: boolean
  isSystemGenerated?: boolean
}

export interface OpportunityLogic {
  id: string
  field: string
  operator: string
  value: string | string[]
  isLocked?: boolean
}

export interface OpportunityList {
  id: string
  title: string
  createdBy: string
  updatedBy: string
  createdOn: string
  updatedOn: string
  status: "Active" | "Inactive"
  fields: OpportunityField[]
  logic: OpportunityLogic[]
}

// Initial opportunity lists data - max 3 logic fields per list
const defaultOpportunityLists: OpportunityList[] = [
  {
    id: "1",
    title: "UG",
    createdBy: "Ashish Jha",
    updatedBy: "Ashish Jha",
    createdOn: "17/12/2025, 01:17 PM",
    updatedOn: "17/12/2025, 01:28 PM",
    status: "Active",
    fields: [
      {
        id: "1",
        displayName: "Opportunity Stage",
        fieldKey: "opportunity_stage",
        fieldType: "Text Box",
        fieldTypeIcon: "text",
        required: true,
      },
      {
        id: "2",
        displayName: "Program Type",
        fieldKey: "program_type",
        fieldType: "Dropdown",
        fieldTypeIcon: "dropdown",
        properties: "MD: Program > Course",
        required: true,
      },
      {
        id: "3",
        displayName: "Program Name",
        fieldKey: "program_name",
        fieldType: "Dropdown",
        fieldTypeIcon: "dropdown",
        properties: "university_id",
        required: true,
      },
    ],
    logic: [
      { id: "1", field: "Program", operator: "Include", value: "IIT Learning Batch", isLocked: true },
      { id: "2", field: "Program Type", operator: "Include", value: "Certificate" },
      { id: "3", field: "Program Name", operator: "Include", value: ["Data Science", "Python"] },
    ],
  },
  {
    id: "2",
    title: "UG & PG Opportunity",
    createdBy: "Varun Singh",
    updatedBy: "Varun Singh",
    createdOn: "26/11/2025, 01:44 PM",
    updatedOn: "26/11/2025, 01:49 PM",
    status: "Active",
    fields: [
      {
        id: "1",
        displayName: "Opportunity Stage",
        fieldKey: "opportunity_stage",
        fieldType: "Text Box",
        fieldTypeIcon: "text",
        required: true,
      },
      {
        id: "2",
        displayName: "Course Interest",
        fieldKey: "course_interest",
        fieldType: "Dropdown",
        fieldTypeIcon: "dropdown",
        required: true,
      },
    ],
    logic: [
      { id: "1", field: "Program", operator: "Include", value: "UG & PG", isLocked: true },
      { id: "2", field: "Course Interest", operator: "Include", value: "Engineering" },
    ],
  },
  {
    id: "3",
    title: "BS in DSAI",
    createdBy: "Manisha Kalra",
    updatedBy: "Manisha Kalra",
    createdOn: "24/11/2025, 04:38 PM",
    updatedOn: "24/11/2025, 04:40 PM",
    status: "Active",
    fields: [
      {
        id: "1",
        displayName: "Opportunity Stage",
        fieldKey: "opportunity_stage",
        fieldType: "Text Box",
        fieldTypeIcon: "text",
        required: true,
      },
      {
        id: "2",
        displayName: "Batch",
        fieldKey: "batch",
        fieldType: "Dropdown",
        fieldTypeIcon: "dropdown",
        required: true,
      },
      {
        id: "3",
        displayName: "Campus",
        fieldKey: "campus",
        fieldType: "Dropdown",
        fieldTypeIcon: "dropdown",
        required: true,
      },
    ],
    logic: [
      { id: "1", field: "Program", operator: "Include", value: "BS DSAI", isLocked: true },
      { id: "2", field: "Batch", operator: "Include", value: "2025" },
      { id: "3", field: "Campus", operator: "Include", value: "Online" },
    ],
  },
  {
    id: "4",
    title: "Certificate Opportunity",
    createdBy: "Varun Singh",
    updatedBy: "Varun Singh",
    createdOn: "13/11/2025, 02:36 PM",
    updatedOn: "26/11/2025, 01:44 PM",
    status: "Active",
    fields: [
      {
        id: "1",
        displayName: "Opportunity Stage",
        fieldKey: "opportunity_stage",
        fieldType: "Text Box",
        fieldTypeIcon: "text",
        required: true,
      },
      {
        id: "2",
        displayName: "Certificate Type",
        fieldKey: "certificate_type",
        fieldType: "Dropdown",
        fieldTypeIcon: "dropdown",
        required: true,
      },
    ],
    logic: [
      { id: "1", field: "Program", operator: "Include", value: "Certificate", isLocked: true },
      { id: "2", field: "Certificate Type", operator: "Include", value: "Professional" },
    ],
  },
  {
    id: "5",
    title: "Certificate",
    createdBy: "Varun Singh",
    updatedBy: "Varun Singh",
    createdOn: "10/11/2025, 10:40 PM",
    updatedOn: "14/11/2025, 02:48 PM",
    status: "Inactive",
    fields: [
      {
        id: "1",
        displayName: "Opportunity Stage",
        fieldKey: "opportunity_stage",
        fieldType: "Text Box",
        fieldTypeIcon: "text",
        required: true,
      },
    ],
    logic: [{ id: "1", field: "Program", operator: "Include", value: "Certificate", isLocked: true }],
  },
]

const STORAGE_KEY = "opportunity-lists"

const SAMPLE_EXAM_CATEGORY: OpportunityList = {
  id: "exam-category-sample",
  title: "Exam Category",
  createdBy: "System Admin",
  updatedBy: "System Admin",
  createdOn: "17/12/2025, 05:30 PM",
  updatedOn: "17/12/2025, 05:30 PM",
  status: "Active",
  fields: [
    {
      id: "1",
      displayName: "Opportunity Stage",
      fieldKey: "opportunity_stage",
      fieldType: "Text Box",
      fieldTypeIcon: "text",
      required: true,
    },
    {
      id: "2",
      displayName: "Exam Category",
      fieldKey: "exam_category",
      fieldType: "Dropdown",
      fieldTypeIcon: "dropdown",
      properties: "Auto-populated from Lead",
      required: true,
      isSystemGenerated: true,
    },
    {
      id: "3",
      displayName: "Course ID",
      fieldKey: "course_id",
      fieldType: "Dropdown",
      fieldTypeIcon: "dropdown",
      properties: "Auto-populated from Lead",
      required: true,
      isSystemGenerated: true,
    },
  ],
  logic: [
    { id: "1", field: "Exam Category", operator: "Include", value: ["JEE", "NEET", "CAT", "GATE"], isLocked: false },
    { id: "2", field: "Course ID", operator: "Include", value: ["CS101", "CS102", "CS103"], isLocked: false },
  ],
}

// Get opportunity lists from localStorage or return defaults
export function getOpportunityLists(): OpportunityList[] {
  if (typeof window === "undefined") return defaultOpportunityLists

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const lists = JSON.parse(stored) as OpportunityList[]
      const examCategoryIndex = lists.findIndex((l) => l.id === "exam-category-sample" || l.title === "Exam Category")
      if (examCategoryIndex === -1) {
        lists.push(SAMPLE_EXAM_CATEGORY)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lists))
      } else {
        const existing = lists[examCategoryIndex]
        if (existing.logic.length !== 2 || !existing.logic.some((l) => l.field === "Exam Category")) {
          lists[examCategoryIndex] = SAMPLE_EXAM_CATEGORY
          localStorage.setItem(STORAGE_KEY, JSON.stringify(lists))
        }
      }
      return lists
    }
  } catch (e) {
    console.error("Error reading opportunity lists from storage:", e)
  }
  const listsWithSample = defaultOpportunityLists.some((l) => l.title === "Exam Category")
    ? defaultOpportunityLists
    : [...defaultOpportunityLists, SAMPLE_EXAM_CATEGORY]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(listsWithSample))
  return listsWithSample
}

// Save opportunity lists to localStorage
export function saveOpportunityLists(lists: OpportunityList[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists))
  } catch (e) {
    console.error("Error saving opportunity lists to storage:", e)
  }
}

// Get only active opportunity lists with >1 logic fields (for stickiness rules)
export function getActiveOpportunityListsForStickiness(): {
  id: string
  name: string
  logicFields: string[]
  isActive: boolean
}[] {
  const lists = getOpportunityLists()
  return lists
    .filter((list) => list.status === "Active" && list.logic.length > 1)
    .map((list) => ({
      id: list.id,
      name: list.title,
      logicFields: list.logic.map((l) => l.field),
      isActive: list.status === "Active",
    }))
}

// Check if an opportunity list is still active (for marking stickiness rules as inactive)
export function isOpportunityListActive(listId: string): boolean {
  const lists = getOpportunityLists()
  const list = lists.find((l) => l.id === listId || l.title === listId)
  return list?.status === "Active" ?? false
}
