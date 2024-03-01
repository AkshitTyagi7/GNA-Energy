import { DocumentModel } from "./Models"
import './Documents.css'
import {ReactComponent as DocumentIcon} from '../../icons/document-icon.svg';
import {ReactComponent as SearchIcon} from '../../icons/search.svg';
import {ReactComponent as ViewIcon} from '../../icons/eye.svg';
import {ReactComponent as DownloadIcon} from '../../icons/download.svg';
import {ReactComponent as Chat} from '../../icons/chat.svg';

export function Documents(){
    return (
        <div>
            <div className="p-10">
                <div>
                    <input type="text" placeholder="Search" className="document-search" />
                </div>
                <div className="main-container">
                    <div className="document-container">

                        <DocItem  document={
                            {
                                id: 1,
                                title: "Document 1",
                                date: "12 Feburary 2023",
                                file: "file",
                                fileId: "fileId"
                            }
                        }  />
                        <DocItem  document={
                            {
                                id: 1,
                                title: "Document 1",
                                date: "12 Feburary 2023",
                                file: "file",
                                fileId: "fileId"
                            }
                        }  />
                        <DocItem  document={
                            {
                                id: 1,
                                title: "Document 1",
                                date: "12 Feburary 2023",
                                file: "file",
                                fileId: "fileId"
                            }
                        }  />
                        <DocItem  document={
                            {
                                id: 1,
                                title: "Document 1",
                                date: "12 Feburary 2023",
                                file: "file",
                                fileId: "fileId"
                            }
                        }  />
                        <DocItem  document={
                            {
                                id: 1,
                                title: "Document 1",
                                date: "12 Feburary 2023",
                                file: "file",
                                fileId: "fileId"
                            }
                        }  />
                        <DocItem  document={
                            {
                                id: 1,
                                title: "Document 1",
                                date: "12 Feburary 2023",
                                file: "file",
                                fileId: "fileId"
                            }
                        }  />
                        <DocItem  document={
                            {
                                id: 1,
                                title: "Document 1",
                                date: "12 Feburary 2023",
                                file: "file",
                                fileId: "fileId"
                            }
                        }  />
                        <DocItem  document={
                            {
                                id: 1,
                                title: "Document 1",
                                date: "12 Feburary 2023",
                                file: "file",
                                fileId: "fileId"
                            }
                        }  />
                        <DocItem  document={
                            {
                                id: 1,
                                title: "Document 1",
                                date: "12 Feburary 2023",
                                file: "file",
                                fileId: "fileId"
                            }
                        }  />
                        <DocItem  document={
                            {
                                id: 1,
                                title: "Document 1",
                                date: "12 Feburary 2023",
                                file: "file",
                                fileId: "fileId"
                            }
                        }  />
                    </div>

                    <div className="filter-container">

                    </div>

                </div>
            </div>
        </div>
    )
}

const DocItem = ({document}:{document: DocumentModel}) => {
    return (
        <div className="document-item">
            <div className="document-item-row">
                <DocumentIcon width={"4vw"}   />
            <span className="document-title">{document.title}</span>
            </div>

            <p className="document-date">
            {
                document.date
            }
            </p>
            <div className="document-item-row">
                <ViewIcon width={"3vw"} />
                <DownloadIcon width={"3vw"}  />
                <Chat width={"2vw"} 
                 />

            </div>
        </div>
    )
}