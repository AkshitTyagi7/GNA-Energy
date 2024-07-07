import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface DocumentModel {
  createElement(arg0: string): unknown;
  body: any;
  id: number;
  title: string;
  documentDate: string;
  file: string;
  filename: string;
  fy: string | undefined;
  siteUrl: string | undefined;
  documentUrl: string | undefined;
  content: string | undefined;
  exchange: string[] | undefined;
  state: string[] | undefined;
  fileId: string;
}

export interface StateDiscomFilter {
  state: string;
  discom: string[];
}

export interface DocumentFilter {
  discoms: string[] | undefined;
  states: string[] | undefined;
  stateDiscom: StateDiscomFilter[] | undefined;
  types: string[] | undefined;
}

export interface Message{
  content: string,
  role: string,
  source?: {
    page: number,
    name: string
  }[]
}



export interface DocumentState {
  documents: DocumentModel[];
  filters: DocumentFilter;
  gnaiActive: boolean;
  typing: boolean;
  chats: Message[];

}


const initialState: DocumentState = {
  documents: [],
  filters: {
    discoms: [],
    stateDiscom: [],
    states: [],
    types: [],
  },
  gnaiActive: false,
  typing: false,
  chats: []
};

const documentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    setDocuments: (
      state: DocumentState,
      action: PayloadAction<DocumentModel[]>
    ) => {
      state.documents = action.payload;
    },
    setDocumentFilters: (
      state: DocumentState,
      action: PayloadAction<DocumentFilter>
    ) => {
      state.filters = action.payload;
    },
    setTyping: (
      state: DocumentState,
      action: PayloadAction<boolean>
    ) => {
      state.typing = action.payload;
    },
    setStates: (
      state: DocumentState,
      action: PayloadAction<string[]>
    ) => {
      state.filters.states = action.payload;
    }
    ,
    setDiscoms: (
      state: DocumentState,
      action: PayloadAction<string[]>
    ) => {
      state.filters.discoms = action.payload;
    },
    addDocument: (
      state: DocumentState,
      action: PayloadAction<DocumentModel>
    ) => {
      state.documents.push(action.payload);
    },
    setGNAiVisibility: (
      state: DocumentState,
      action: PayloadAction<boolean>
    ) => {
      state.gnaiActive = action.payload;
    },
    addMessage: (
      state: DocumentState,
      action: PayloadAction<Message>
    ) => {
      state.chats.push(action.payload);
    },
    resetMessages: (
      state: DocumentState
    ) => {
      state.chats = [];
    }

  },
});

export const { addDocument, setDocuments, setDocumentFilters,setGNAiVisibility,setTyping, addMessage, resetMessages, setDiscoms  } = documentSlice.actions;

export default documentSlice.reducer;
