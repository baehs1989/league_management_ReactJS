import React, { Component} from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PdfDocument } from "./Document";

class Test extends Component {
    state = {
    }

    render(){

        return (
            <div>
                Hello

                <PDFDownloadLink
                    document={<PdfDocument/>}
                    fileName="movielist.pdf"
                    style={{
                    textDecoration: "none",
                    padding: "10px",
                    color: "#4a4a4a",
                    backgroundColor: "#f2f2f2",
                    border: "1px solid #4a4a4a"
                    }}
                >
                    {({ blob, url, loading, error }) =>
                    loading ? "Loading document..." : "Download Pdf"
                    }
                </PDFDownloadLink>



            </div>
        )
    }
}

export default Test;