import React from "react";

const EstimateLineItems = (props: any) => {
  let estimateData = props.estimateData;
  return (
    <div style={{ borderBottom: "3px solid #C99B2C", paddingBottom: "30px" }}>
      {!estimateData.lineItems.length && <table
        style={{
          borderCollapse: "collapse",
          marginLeft: "5.75pt",
          marginTop: "70px",
          width: "100%"
        }}
        cellSpacing={0}
      >
        <tbody>
        <tr style={{ height: "16pt" }}>
          <td
            style={{
              width: "554pt",
              borderTopStyle: "solid",
              borderTopWidth: "2pt",
              borderLeftStyle: "solid",
              borderLeftWidth: "2pt",
              borderBottomStyle: "solid",
              borderBottomWidth: "2pt",
              borderRightStyle: "solid",
              borderRightWidth: "2pt",
              backgroundColor: "#7E7E7E"
            }}
            colSpan={3}
          >
            <p
              className="s13"
              style={{
                paddingLeft: "100pt",
                paddingRight: "100pt",
                textIndent: "0pt",
                lineHeight: "14pt",
                textAlign: "center"
              }}
            >
              {estimateData?.referenceNumber}
            </p>
          </td>
        </tr>
        <tr style={{ height: "15pt" }}>
          <td
            style={{
              width: "365pt",
              borderTopStyle: "solid",
              borderTopWidth: "2pt",
              borderLeftStyle: "solid",
              borderLeftWidth: "2pt",
              borderBottomStyle: "solid",
              borderBottomWidth: "2pt",
              borderRightStyle: "solid",
              borderRightWidth: "2pt",
              backgroundColor: "#2BAADD"
            }}
          >
            <p
              className="s14"
              style={{
                paddingLeft: "5pt",
                textIndent: "0pt",
                lineHeight: "14pt",
                textAlign: "left"
              }}
            >
              Description
            </p>
          </td>
          <td
            style={{
              width: "103pt",
              borderTopStyle: "solid",
              borderTopWidth: "2pt",
              borderLeftStyle: "solid",
              borderLeftWidth: "2pt",
              borderBottomStyle: "solid",
              borderBottomWidth: "2pt",
              borderRightStyle: "solid",
              borderRightWidth: "2pt",
              backgroundColor: "#2BAADD"
            }}
          >
            <p
              className="s14"
              style={{
                paddingLeft: "4pt",
                textIndent: "0pt",
                lineHeight: "14pt",
                textAlign: "left"
              }}
            >
              Each
            </p>
          </td>
          <td
            style={{
              width: "86pt",
              borderTopStyle: "solid",
              borderTopWidth: "2pt",
              borderLeftStyle: "solid",
              borderLeftWidth: "2pt",
              borderBottomStyle: "solid",
              borderBottomWidth: "2pt",
              borderRightStyle: "solid",
              borderRightWidth: "2pt",
              backgroundColor: "#2BAADD"
            }}
          >
            <p
              className="s14"
              style={{
                paddingLeft: "5pt",
                textIndent: "0pt",
                lineHeight: "14pt",
                textAlign: "left"
              }}
            >
              Price
            </p>
          </td>
        </tr>
        <tr style={{ height: "16pt" }}>
          <td
            style={{
              width: "365pt",
              borderTopStyle: "solid",
              borderTopWidth: "2pt",
              borderLeftStyle: "solid",
              borderLeftWidth: "2pt",
              borderBottomStyle: "solid",
              borderBottomWidth: "2pt",
              borderRightStyle: "solid",
              borderRightWidth: "2pt"
            }}
          >
            <p
              className="s14"
              style={{
                paddingLeft: "5pt",
                textIndent: "0pt",
                lineHeight: "14pt",
                textAlign: "left"
              }}
            >
              {estimateData?.referenceNumber}
            </p>
          </td>
          <td
            style={{
              width: "103pt",
              borderTopStyle: "solid",
              borderTopWidth: "2pt",
              borderLeftStyle: "solid",
              borderLeftWidth: "2pt",
              borderBottomStyle: "solid",
              borderBottomWidth: "2pt",
              borderRightStyle: "solid",
              borderRightWidth: "2pt"
            }}
          >
            <p style={{ textIndent: "0pt", textAlign: "left" }}>
              <br />
            </p>
          </td>
          <td
            style={{
              width: "86pt",
              borderTopStyle: "solid",
              borderTopWidth: "2pt",
              borderLeftStyle: "solid",
              borderLeftWidth: "2pt",
              borderBottomStyle: "solid",
              borderBottomWidth: "2pt",
              borderRightStyle: "solid",
              borderRightWidth: "2pt"
            }}
          >
            <p style={{ textIndent: "0pt", textAlign: "left" }}>
              <br />
            </p>
          </td>
        </tr>
        <tr style={{ height: "15pt" }}>
          <td
            style={{
              width: "365pt",
              borderTopStyle: "solid",
              borderTopWidth: "2pt",
              borderLeftStyle: "solid",
              borderLeftWidth: "2pt",
              borderBottomStyle: "solid",
              borderBottomWidth: "2pt",
              borderRightStyle: "solid",
              borderRightWidth: "2pt"
            }}
          >
            <p style={{ textIndent: "0pt", textAlign: "left" }}>
              <br />
            </p>
          </td>
          <td
            style={{
              width: "103pt",
              borderTopStyle: "solid",
              borderTopWidth: "2pt",
              borderLeftStyle: "solid",
              borderLeftWidth: "2pt",
              borderBottomStyle: "solid",
              borderBottomWidth: "2pt",
              borderRightStyle: "solid",
              borderRightWidth: "2pt"
            }}
          >
            <p
              className="s14"
              style={{
                paddingLeft: "4pt",
                textIndent: "0pt",
                lineHeight: "13pt",
                textAlign: "left"
              }}
            >
              Total
            </p>
          </td>
          <td
            style={{
              width: "86pt",
              borderTopStyle: "solid",
              borderTopWidth: "2pt",
              borderLeftStyle: "solid",
              borderLeftWidth: "2pt",
              borderBottomStyle: "solid",
              borderBottomWidth: "2pt",
              borderRightStyle: "solid",
              borderRightWidth: "2pt"
            }}
          >
            <p
              className="s14"
              style={{
                paddingLeft: "5pt",
                textIndent: "0pt",
                lineHeight: "13pt",
                textAlign: "left"
              }}
            >
              ${estimateData?.total}
            </p>
          </td>
        </tr>
        </tbody>
      </table>}

      {estimateData.lineItems && estimateData.lineItems.map((lineItem: any) => <>
        <table
          key={lineItem._id}
          style={{
            borderCollapse: "collapse",
            marginLeft: "5.75pt",
            marginTop: "40px",
            width: "100%"
          }}
          cellSpacing={0}
        >
          <tbody>
          <tr style={{ height: "16pt" }}>
            <td
              style={{
                width: "554pt",
                borderTopStyle: "solid",
                borderTopWidth: "2pt",
                borderLeftStyle: "solid",
                borderLeftWidth: "2pt",
                borderBottomStyle: "solid",
                borderBottomWidth: "2pt",
                borderRightStyle: "solid",
                borderRightWidth: "2pt",
                backgroundColor: "#7E7E7E"
              }}
              colSpan={3}
            >
              <p
                className="s13"
                style={{
                  paddingLeft: "100pt",
                  paddingRight: "100pt",
                  textIndent: "0pt",
                  lineHeight: "14pt",
                  textAlign: "center"
                }}
              >
                {lineItem?.referenceNumber}
              </p>
            </td>
          </tr>
          <tr style={{ height: "15pt" }}>
            <td
              style={{
                width: "365pt",
                borderTopStyle: "solid",
                borderTopWidth: "2pt",
                borderLeftStyle: "solid",
                borderLeftWidth: "2pt",
                borderBottomStyle: "solid",
                borderBottomWidth: "2pt",
                borderRightStyle: "solid",
                borderRightWidth: "2pt",
                backgroundColor: "#2BAADD"
              }}
            >
              <p
                className="s14"
                style={{
                  paddingLeft: "5pt",
                  textIndent: "0pt",
                  lineHeight: "14pt",
                  textAlign: "left"
                }}
              >
                Description
              </p>
            </td>
            <td
              style={{
                width: "103pt",
                borderTopStyle: "solid",
                borderTopWidth: "2pt",
                borderLeftStyle: "solid",
                borderLeftWidth: "2pt",
                borderBottomStyle: "solid",
                borderBottomWidth: "2pt",
                borderRightStyle: "solid",
                borderRightWidth: "2pt",
                backgroundColor: "#2BAADD"
              }}
            >
              <p
                className="s14"
                style={{
                  paddingLeft: "4pt",
                  textIndent: "0pt",
                  lineHeight: "14pt",
                  textAlign: "left"
                }}
              >
                Each
              </p>
            </td>
            <td
              style={{
                width: "86pt",
                borderTopStyle: "solid",
                borderTopWidth: "2pt",
                borderLeftStyle: "solid",
                borderLeftWidth: "2pt",
                borderBottomStyle: "solid",
                borderBottomWidth: "2pt",
                borderRightStyle: "solid",
                borderRightWidth: "2pt",
                backgroundColor: "#2BAADD"
              }}
            >
              <p
                className="s14"
                style={{
                  paddingLeft: "5pt",
                  textIndent: "0pt",
                  lineHeight: "14pt",
                  textAlign: "left"
                }}
              >
                Price
              </p>
            </td>
          </tr>
          <tr style={{ height: "16pt" }}>
            <td
              style={{
                width: "365pt",
                borderTopStyle: "solid",
                borderTopWidth: "2pt",
                borderLeftStyle: "solid",
                borderLeftWidth: "2pt",
                borderBottomStyle: "solid",
                borderBottomWidth: "2pt",
                borderRightStyle: "solid",
                borderRightWidth: "2pt"
              }}
            >
              <p
                className="s14"
                style={{
                  paddingLeft: "5pt",
                  textIndent: "0pt",
                  lineHeight: "14pt",
                  textAlign: "left"
                }}
              >
                {lineItem?.referenceNumber}
              </p>
            </td>
            <td
              style={{
                width: "103pt",
                borderTopStyle: "solid",
                borderTopWidth: "2pt",
                borderLeftStyle: "solid",
                borderLeftWidth: "2pt",
                borderBottomStyle: "solid",
                borderBottomWidth: "2pt",
                borderRightStyle: "solid",
                borderRightWidth: "2pt"
              }}
            >
              <p style={{ textIndent: "0pt", textAlign: "left" }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: "86pt",
                borderTopStyle: "solid",
                borderTopWidth: "2pt",
                borderLeftStyle: "solid",
                borderLeftWidth: "2pt",
                borderBottomStyle: "solid",
                borderBottomWidth: "2pt",
                borderRightStyle: "solid",
                borderRightWidth: "2pt"
              }}
            >
              <p style={{ textIndent: "0pt", textAlign: "left" }}>
                <br />
              </p>
            </td>
          </tr>
          <tr style={{ height: "15pt" }}>
            <td
              style={{
                width: "365pt",
                borderTopStyle: "solid",
                borderTopWidth: "2pt",
                borderLeftStyle: "solid",
                borderLeftWidth: "2pt",
                borderBottomStyle: "solid",
                borderBottomWidth: "2pt",
                borderRightStyle: "solid",
                borderRightWidth: "2pt"
              }}
            >
              <p style={{ textIndent: "0pt", textAlign: "left" }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: "103pt",
                borderTopStyle: "solid",
                borderTopWidth: "2pt",
                borderLeftStyle: "solid",
                borderLeftWidth: "2pt",
                borderBottomStyle: "solid",
                borderBottomWidth: "2pt",
                borderRightStyle: "solid",
                borderRightWidth: "2pt"
              }}
            >
              <p
                className="s14"
                style={{
                  paddingLeft: "4pt",
                  textIndent: "0pt",
                  lineHeight: "13pt",
                  textAlign: "left"
                }}
              >
                Total
              </p>
            </td>
            <td
              style={{
                width: "86pt",
                borderTopStyle: "solid",
                borderTopWidth: "2pt",
                borderLeftStyle: "solid",
                borderLeftWidth: "2pt",
                borderBottomStyle: "solid",
                borderBottomWidth: "2pt",
                borderRightStyle: "solid",
                borderRightWidth: "2pt"
              }}
            >
              <p
                className="s14"
                style={{
                  paddingLeft: "5pt",
                  textIndent: "0pt",
                  lineHeight: "13pt",
                  textAlign: "left"
                }}
              >
                ${lineItem?.total}
              </p>
            </td>
          </tr>
          </tbody>
        </table>
        <p style={{ textIndent: "0pt", textAlign: "left" }}>
          <br />
        </p>
        <p style={{ textIndent: "0pt", textAlign: "left" }}>
          <br />
        </p>
        <ul id="l1">
          <li data-list-text="*">
            <p
              style={{
                paddingLeft: "10pt",
                textIndent: "0pt",
                lineHeight: "108%",
                textAlign: "left",
                whiteSpace: "pre-line"
              }}
            >
              {lineItem?.terms}
            </p>
          </li>
        </ul>
      </>)}


      <ul className="pt-4" id="l1">
        <li data-list-text="*">
          <p
            style={{
              paddingLeft: "10pt",
              textIndent: "0pt",
              lineHeight: "108%",
              textAlign: "left",
              whiteSpace: "pre-line"
            }}
          >
            {estimateData?.terms}
          </p>
        </li>
        {/*<li data-list-text="*">*/}
        {/*  <p*/}
        {/*    style={{*/}
        {/*      paddingTop: "9pt",*/}
        {/*      paddingLeft: "10pt",*/}
        {/*      textIndent: "0pt",*/}
        {/*      lineHeight: "108%",*/}
        {/*      textAlign: "left",*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    Perform environmental pre-task safety meeting. Address all hazards*/}
        {/*    identified in pre-job safety walk and outlined in project work plan*/}
        {/*    / JHA. Discuss specific hierarchy of hazard controls.*/}
        {/*  </p>*/}
        {/*</li>*/}
        {/*<li data-list-text="*">*/}
        {/*  <p*/}
        {/*    style={{*/}
        {/*      paddingTop: "7pt",*/}
        {/*      paddingLeft: "10pt",*/}
        {/*      textIndent: "0pt",*/}
        {/*      lineHeight: "108%",*/}
        {/*      textAlign: "left",*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    Setup decontamination zones (Exclusion Zone (hot zone),*/}
        {/*    Contamination Reduction Zone (warm zone), Support Zone (cold zone).*/}
        {/*  </p>*/}
        {/*  <p*/}
        {/*    style={{*/}
        {/*      paddingTop: "8pt",*/}
        {/*      paddingLeft: "10pt",*/}
        {/*      textIndent: "0pt",*/}
        {/*      lineHeight: "108%",*/}
        {/*      textAlign: "left",*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    *This will include 01PCWS/R-38EE-SBU-07, 01UPWS/R-38EE-SBN-03 &amp;*/}
        {/*    AW Litmus Lines that need to be drained, cut &amp; capped above pump*/}
        {/*    rack.*/}
        {/*  </p>*/}
        {/*  <p*/}
        {/*    style={{*/}
        {/*      paddingTop: "7pt",*/}
        {/*      paddingLeft: "10pt",*/}
        {/*      textIndent: "0pt",*/}
        {/*      textAlign: "left",*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    *The HF Tech Team will drain all PCW/UPW from low points draining*/}
        {/*    all waters into 55 gallon drum.*/}
        {/*  </p>*/}
        {/*  <p*/}
        {/*    style={{*/}
        {/*      paddingTop: "9pt",*/}
        {/*      paddingLeft: "10pt",*/}
        {/*      textIndent: "0pt",*/}
        {/*      lineHeight: "108%",*/}
        {/*      textAlign: "left",*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    *Once PCW is drained the crew will cut and cap 3/4 PVC just above*/}
        {/*    pump rack at OK to Demo tags. UPW lines will also be cut and capped*/}
        {/*    above pump rack as tagged once drained.*/}
        {/*  </p>*/}
        {/*  <p*/}
        {/*    className="s15"*/}
        {/*    style={{*/}
        {/*      paddingTop: "7pt",*/}
        {/*      paddingLeft: "10pt",*/}
        {/*      textIndent: "0pt",*/}
        {/*      textAlign: "left",*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    *Litmus line will be drained and capped at the pump rack &amp; at*/}
        {/*    column S-39.*/}
        {/*  </p>*/}
        {/*</li>*/}
        {/*<li data-list-text="*">*/}
        {/*  <p*/}
        {/*    className="s15"*/}
        {/*    style={{*/}
        {/*      paddingTop: "9pt",*/}
        {/*      paddingLeft: "18pt",*/}
        {/*      textIndent: "-8pt",*/}
        {/*      textAlign: "left",*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    The HF Tech Team will pull vacuum on all water lines to make sure*/}
        {/*    system is drained.*/}
        {/*  </p>*/}
        {/*</li>*/}
        {/*<li data-list-text="*">*/}
        {/*  <p*/}
        {/*    className="s15"*/}
        {/*    style={{*/}
        {/*      paddingTop: "9pt",*/}
        {/*      paddingLeft: "10pt",*/}
        {/*      textIndent: "0pt",*/}
        {/*      lineHeight: "108%",*/}
        {/*      textAlign: "left",*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    Waste Management - All Liquid waste will collected into buckets and*/}
        {/*    delivered to Intel Haz Doc, Solid waste will be double-bagged*/}
        {/*    (Intel-specific color bag according to waste) labeled, and*/}
        {/*    transported to the appropriate waste bin.*/}
        {/*  </p>*/}
        {/*</li>*/}
      </ul>


    </div>
  );
};

export default EstimateLineItems;
