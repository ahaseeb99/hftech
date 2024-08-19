import React from "react";
import { useSelector } from "react-redux";
import { timezoneDateConverter } from '../../../utils/helpers';
const EstimatePdfContent = (props: any) => {
  const { user } = useSelector((state: any) => state.auth);
  console.info("----------------------------");
  console.info("props.estimateData =>", props.estimateData);
  console.info("----------------------------");


  let estimateData = props.estimateData;
  const descriptionHTML = estimateData?.description;
  const withoutHtmlTagsDescription = descriptionHTML.replace(/<[^>]+>/g, '');
  const description = withoutHtmlTagsDescription.replaceAll('&nbsp;', '');
  return (
    <div style={{ borderBottom: "3px solid #C99B2C" }}>
      <>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <style
          type="text/css"
          dangerouslySetInnerHTML={{
            __html:
              ' * {margin:0; padding:0; text-indent:0; }\n .s1 { color: #D0A74F; font-family:Calibri, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 11.5pt; }\n .s2 { color: #3F5C73; font-family:Calibri, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 11.5pt; }\n .s3 { color: #405C73; font-family:Calibri, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 11.5pt; }\n p { color: #565759; font-family:Calibri, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 11pt; margin:0pt; }\n .s5 { color: #565759; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 11pt; }\n .s6 { color: #56575B; font-family:Calibri, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 11pt; }\n h1 { color: #003740; font-family:Arial, sans-serif; font-style: normal; font-weight: bold; text-decoration: none; font-size: 11pt; }\n .s8 { color: black; font-family:"Times New Roman", serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; }\n .s9 { color: #003740; font-family:Calibri, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 9pt; }\n a { color: #00F; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: underline; font-size: 9pt; }\n .s11 { color: #003740; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 8pt; }\n .s12 { color: #36CACF; font-family:Arial, sans-serif; font-style: italic; font-weight: normal; text-decoration: none; font-size: 9pt; }\n .s13 { color: #FFF; font-family:Calibri, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 13pt; }\n .s14 { color: black; font-family:Calibri, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 13pt; }\n .s15 { color: black; font-family:Calibri, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 11pt; }\n li {display: block; }\n #l1 {padding-left: 0pt; }\n #l1> li>*:first-child:before {content: "* "; color: black; font-family:Calibri, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; }\n table, tbody {vertical-align: top; overflow: visible; }\n',
          }}
        />
        <p style={{ textIndent: "0pt", textAlign: "left" }}>
          <br />
        </p>
        <p
          className="s1"
          style={{
            paddingTop: "2pt",
            paddingLeft: "10pt",
            textIndent: "0pt",
            textAlign: "left",
          }}
        >
          {timezoneDateConverter(estimateData?.date, user.userTimezone)}
        </p>
        <p style={{ textIndent: "0pt", textAlign: "left" }}>
          <br />
        </p>
        <p
          className="s2"
          style={{ paddingLeft: "10pt", textIndent: "0pt", textAlign: "left" }}
        >
          {estimateData?.client?.fullName}
        </p>
        <p
          className="s2"
          style={{ paddingLeft: "10pt", textIndent: "0pt", textAlign: "left" }}
        >
          {estimateData?.locationId?.locationName}
        </p>
        <p
          className="s2"
          style={{ paddingLeft: "10pt", textIndent: "0pt", textAlign: "left" }}
        >
          {estimateData?.locationId?.address}
        </p>
        <p
          className="s3"
          style={{
            paddingLeft: "10pt",
            textIndent: "0pt",
            lineHeight: "200%",
            textAlign: "left",
          }}
        >
          {estimateData?.locationId?.city},{estimateData?.locationId?.state}
        </p>
        <p
          style={{
            paddingLeft: "10pt",
            textIndent: "0pt",
            textAlign: "left",
            margin: "20px 0",
          }}
        >
          <span style={{ color: "#D0A74E" }}>
            REFERENCE: {estimateData?.referenceNumber}
          </span>
        </p>
        <p
          style={{ paddingLeft: "10pt", textIndent: "0pt", textAlign: "left" }}
        >
          Dear {estimateData?.client?.fullName},
        </p>
        <p style={{ textIndent: "0pt", textAlign: "left" }}>
          <br />
        </p>
        <p
          style={{ paddingLeft: "10pt", textIndent: "0pt", textAlign: "left" }}
        >
          {/*HF TECH is pleased to present this proposal to perform*/}
          {/*{estimateData?.description}*/}
          {description}
          <span className="s5">…</span>
        </p>
        <p style={{ textIndent: "0pt", textAlign: "left" }}>
          <br />
        </p>
        <p
          style={{
            paddingTop: "6pt",
            paddingLeft: "10pt",
            textIndent: "0pt",
            textAlign: "left",
          }}
        >
          Thank you for this opportunity. If you have any questions or{" "}
          <span style={{ color: "#56575B" }}>concerns</span>, please do not
          hesitate to contact me at
        </p>
        <p
          style={{ paddingLeft: "10pt", textIndent: "0pt", textAlign: "left" }}
        >
          (480) 529-9177.
        </p>
        <p style={{ textIndent: "0pt", textAlign: "left" }}>
          <br />
        </p>
        <p
          className="s6"
          style={{
            paddingLeft: "10pt",
            textIndent: "0pt",
            lineHeight: "200%",
            textAlign: "left",
          }}
        >
          We look forward to teaming up on future work!{" "}
          <div style={{ color: "#565759" }}>Sincerely,</div>
        </p>
        <p style={{ textIndent: "0pt", textAlign: "left" }}>
          <br />
        </p>
        <p
          style={{ paddingLeft: "19pt", textIndent: "0pt", textAlign: "left" }}
        >
          <span />
        </p>
        <table style={{ border: 0 }} cellSpacing={0} cellPadding={0}>
          <tbody>
            <tr>
              <td>
                {/*<img*/}
                {/*  width={177}*/}
                {/*  height={58}*/}
                {/*  src="data:image/jpg;base64,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"*/}
                {/*/>*/}

                <img width="50%"
                     height="auto" src={user?.signature} alt="signature" />
              </td>
            </tr>
          </tbody>
        </table>
        <p />
        {/*<p style={{ textIndent: "0pt", textAlign: "left" }}>*/}
        {/*  <br />*/}
        {/*</p>*/}
        <p style={{ textIndent: "0pt", textAlign: "left" }} />
        <p
          className="s8"
          style={{
            paddingTop: "50px",
            paddingLeft: "12pt",
            textIndent: "0pt",
            textAlign: "left",
          }}
        >
          <span />
        </p>
        <table style={{ border: 0 }} cellSpacing={0} cellPadding={0}>
          <tbody>
            <tr>
              <td style={{ paddingRight: "20px", borderRight: "2px solid" }}>
                <img
                  width={110}
                  height={43}
                  src="data:image/png;base64,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"
                />
              </td>
              <td style={{ paddingLeft: "20px" }}>
                <h1
                  style={{
                    paddingLeft: "",
                    textIndent: "0pt",
                    textAlign: "left",
                    marginBottom: "30px",
                  }}
                >
                  {user?.firstName} {user?.lastName} <i>Division 1 Project Manager</i>
                </h1>
                <p>
                  <span className="s9">M: </span>
                  <a
                    href="http://hftechaz.com/"
                    style={{
                      color: "#003740",
                      fontFamily: "Arial, sans-serif",
                      fontStyle: "normal",
                      fontWeight: "normal",
                      textDecoration: "none",
                      fontSize: "9pt",
                    }}
                    target="_blank"
                  >
                    480-529-9177 •{" "}
                  </a>
                  {/*<a href="http://hftechaz.com/" target="_blank">*/}
                  {/*  hftechaz.com*/}
                  {/*</a>*/}
                  <a href={`mailto:${user?.email}`} target="_blank">
                    {user?.email}
                  </a>
                </p>
                <p
                  className="s11"
                  style={{
                    paddingTop: "10pt",
                    paddingLeft: "",
                    textIndent: "0pt",
                    textAlign: "left",
                  }}
                >
                  ENVIRONMENTAL FIELD SERVICES &amp; EHS CONSULTING
                </p>
                <p
                  className="s12"
                  style={{
                    paddingLeft: "",
                    textIndent: "0pt",
                    textAlign: "left",
                  }}
                >
                  A Minority Owned, Arizona Company
                </p>
              </td>
            </tr>
          </tbody>
        </table>{" "}
        <p />
        <p style={{ textIndent: "0pt", textAlign: "left" }}>
          <br />
        </p>
        <p style={{ textIndent: "0pt", textAlign: "left" }}>
          <br />
        </p>
        <p style={{ textIndent: "0pt", textAlign: "left" }}>
          <br />
        </p>
      </>
    </div>
  );
};

export default EstimatePdfContent;
