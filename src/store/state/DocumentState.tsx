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
export interface DocumentFilter {
  discoms: string[] | undefined;
  states: string[] | undefined;
  types: string[] | undefined;
}

export interface Message{
  content: string,
  role: string
}

export interface DocumentState {
  documents: DocumentModel[];
  filters: DocumentFilter;
  gnaiActive: boolean;
  chats: Message[];

}


const initialState: DocumentState = {
  documents: [],
  filters: {
    discoms: [],
    states: [],
    types: [],
  },
  gnaiActive: false,
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

export const { addDocument, setDocuments, setDocumentFilters,setGNAiVisibility, addMessage, resetMessages  } = documentSlice.actions;

export default documentSlice.reducer;
