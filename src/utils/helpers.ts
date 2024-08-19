import { BACKEND_BASE_URL } from "../config";
import urlJoin from 'url-join';
import moment from "moment";
const Logo = 'http://hftechaz.com/hf-tech-logo.png'

export const imageUrlToBase64 = async (file) => {
  const response = await fetch(file);
  const blob = await response.blob();
  return new Promise((onSuccess, onError) => {
    try {
      const reader = new FileReader() ;
      reader.onload = function(){
        onSuccess(this.result) 
        } ;
      reader.readAsDataURL(blob) ;
    } catch(e) {
      onError(e);
    }
  });
};

export const getOptionsParameter = (firstName: string, lastName: string) => {
  return {
    width: 600,
    height: 100,
    paddingX: 30,
    paddingY: 50,
    canvasTargetDom: ".js-canvasTargetDom",
    font: ["50px", "'Rock Salt'"],
    color: "#423b3b",
    textString: `${firstName + " " + lastName}`,
    customFont: {
      name: "'Rock Salt'",
      url: "https://fonts.googleapis.com/css?family=Rock+Salt",
    },
  };
};

// export const getTotalEstimateAmount = (estimateData) => {
//   const {lineItems, total} = estimateData;
//   if (lineItems?.length > 1) {
//     const totalAmount = lineItems.reduce((n, { total }) => n + total, 0);

//     return `$${totalAmount}`;
//   } else return `$${total?.toFixed(2)}`;
// };

export const getTotalEstimateAmount = (estimateData) => {
  const { lineItems, total } = estimateData;
  if (lineItems?.length >= 1) {
    const totalAmount = lineItems.reduce((n, { total ,quantity}) => n + total * quantity, 0);
    return `$${totalAmount?.toLocaleString(undefined, {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    })}`;
  } else {
    return `$${total?.toLocaleString(undefined, {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    })}`;
  }
};

export const generateRandomColor = () => {
  const colors = ["darkblue", "#6288f7", "#e6af3c", "#7a50c6", "#fb1ede"];
  const randomColor = colors[(Math.floor(Math.random() * (colors.length)))];
  return randomColor
}

export const formatPhoneNumber = (phoneNumberString) => {

  var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3];
  }
  return phoneNumberString;
};

export const taskRefinementHTML = (sourceText,Labels?,callerId = "") => {
  let desc = sourceText;
  let text = sourceText;
  let html = "";
  if (sourceText?.length > 0) {
    desc = desc.replace(
      /(Decontamination:Decontamination)|(Decontamination)/,
      '<span class="badge m-1 badge-lg badge-success">Decon</span>&nbsp;'
    );
    desc = desc.replace(
      "(Hazardous)",
      '<span class="badge badge-lg badge-warning">Haz</span>&nbsp;'
    );
    desc = desc.replace(
      "Hazardous",
      '<span class="badge badge-lg m-1 badge-warning">Haz</span>&nbsp;'
    );
    desc = desc.replace(
      "Demolition",
      '<span class="badge badge-lg m-1 badge-success">Demo</span>&nbsp;'
    );
    desc = desc.replace(
      "Emergency Response",
      '<span class="badge badge-lg m-1 badge-danger">ER</span>&nbsp;'
    );
    desc = desc.replace(":", "");
    text = text.replace(
      /(Decontamination:Decontamination)|\(Decontamination\)|Decontamination|\(Hazardous\)|Hazardous|Demolition|Emergency Response/g,
      ""
    );
    text = text.trim();
    text = text.replace(":", "");
    text = text.replace(/::|:/, "");
    const tags = desc.match(/<span[^>]*>[^>]*<\/span>/g);
    const filterLabels = Labels?.map((label) => {
      switch (label) {
        case "Liquid":
          return `<span class="badge badge-lg m-1" style='background-color : lightskyblue'>${label}</span>`;
        case "Jet":
          return `<span class="badge badge-lg m-1" style='background-color : purple'>${label}</span>`;
        case "Scrub":
          return`<span class="badge badge-lg m-1" style='background-color : orange'>${label}</span>`;
        case "Tank":
          return `<span class="badge badge-lg m-1 badge" style='background-color : darkgray'>${label}</span>`;
        case "Rain":
          return `<span class="badge badge-lg m-1" style='background-color : darkblue'>${label}</span>`;
        case "Decon":
          return `<span class="badge badge-lg m-1 badge-success">${label}</span>`;
        case "Demo":
          return `<span class="badge badge-lg m-1 badge-success">${label}</span>`;
        default: return [`<span class="badge badge-lg m-1" style='background-color : ${generateRandomColor()}'>${label}</span>`]
      }
    })
    
    const label = new Set([...filterLabels || [],...tags || []])  
      
    html = "<div>";
    label?.forEach((element) => {
      html += element + "&nbsp;";
    });
    html += "<br />";
    html += text + " - " + callerId;
    html += "</div>";
  }
  return html;
};

export const getWorkorderMailBodyHTML = (workorderData: any, user: any) => {

  return `
  Hello  ${workorderData.Contact.reduce((acc, cur, i) => {
    if(i == (workorderData.Contact.length - 1)) {
      acc += `${cur.fullName}`
    } else {
      acc += `${cur.fullName}, `
    }
    return acc;
  },'')},
  <br><br>

  The HF Tech Team completed the Work Order ${workorderData.Number} - ${workorderData.TaskRefinement}.
  <br><br>

  Thank you for choosing the HF Tech Team!
  <br>

  
  <table style="border:none;" cellSpacing={0} cellPadding={0}>
  <tbody>
  <tr>
    <td style='padding-right: 20px; '>
        <img alt="Logo" style="width: 80px; margin: auto" src=${Logo}>
    </td>
    <td style='padding-left: 20px; margin-top: 20px; border-left: 2px solid #000; display:inline-block;'>
      <span
        style='
          font-weight: bold;
          padding-left: "";
          text-indent: "0pt";
          text-align: "left";
          margin-bottom: "-5px";
          line-height: 0.5;
          font-size: 1.2rem;
        '
      >
        ${user.FirstName} ${user.LastName}, <span style="font-weight: normal;">${user.title}</span>
      </span>
      <br/>
      <br/>
      <span style='line-height: 0.5;'>
        <span className="s9">M: </span>
        <a style='display : inline-block;'
          href="tel:${user.contact}"
          target="_blank"
        >
        ${user.contact}
        </a>
        <span style="padding-left: 5px;">${' • '}</span>
        <a href="" target="_blank">
        ${user.email}
        </a>
      </span>
      <br/>
      <span
        className="s11"
        style='
          padding-top: "10pt";
          padding-left: "";
          line-height: 0.5;
          text-indent: "0pt";
          text-align: "left";
          color: #08495F;
        '
      >
        ENVIRONMENTAL FIELD SERVICES &amp; EHS CONSULTING
      </span>
      <br/>
      <span
        className="s12"
        style='
          padding-left: "";
          text-indent: "0pt";
          text-align: "left";
          line-height: 0.5;
          color: #36CACF;
        '
      >
        A Minority Owned, Arizona Company
      </span>
    </td>
  </tr>
</tbody>
</table>
`;
}

export const getSignatureBodyHTML = (user: any) => {

  return `
  <br />
  <br />
  <table style="border:none;" cellSpacing={0} cellPadding={0}>
  <tbody>
  <tr>
    <td style='padding-right: 20px; '>
        <img alt="Logo" style="width: 80px; margin: auto" src=${Logo}>
    </td>
    <td style='padding-left: 20px; margin-top: 20px; border-left: 2px solid #000; display:inline-block;'>
      <span
        style='
          font-weight: bold;
          padding-left: "";
          text-indent: "0pt";
          text-align: "left";
          margin-bottom: "-5px";
          line-height: 0.5;
          font-size: 1.2rem;
        '
      >
        ${user.FirstName} ${user.LastName}, <span style="font-weight: normal;">${user.title}</span>
      </span>
      <br/>
      <br/>
      <span style='line-height: 0.5;'>
        <span className="s9">M: </span>
        <a style='display : inline-block;'
          href="tel:${user.contact}"
          target="_blank"
        >
        ${user.contact}
        </a>
        <span style="padding-left: 5px;">${' • '}</span>
        <a href="" target="_blank">
        ${user.email}
        </a>
      </span>
      <br/>
      <span
        className="s11"
        style='
          padding-top: "10pt";
          padding-left: "";
          line-height: 0.5;
          text-indent: "0pt";
          text-align: "left";
          color: #08495F;
        '
      >
        ENVIRONMENTAL FIELD SERVICES &amp; EHS CONSULTING
      </span>
      <br/>
      <span
        className="s12"
        style='
          padding-left: "";
          text-indent: "0pt";
          text-align: "left";
          line-height: 0.5;
          color: #36CACF;
        '
      >
        A Minority Owned, Arizona Company
      </span>
    </td>
  </tr>
</tbody>
</table>
`;
}

export const getMailBodyHTML = (estimateData: any, user: any) => {

  console.log("getMailBodyHTML", estimateData);


  return `
  Hello ${estimateData.contactIds.reduce((acc, cur, i) => {
    if(i == (estimateData.contactIds.length - 1)) {
      acc += `${cur.fullName}`
    } else {
      acc += `${cur.fullName}, `
    }
    return acc;
  },'')},
  <br><br>

  Please find the attached Quote for ${estimateData.referenceNumber}.
  <br><br>

  <table style=" text-align: left; border-spacing: 0 5px; color: rgb(86, 87, 89);">
<tbody>
  <tr>
    <td style='padding-right: 20px; '>
        <img alt="Logo" style="width: 80px; margin: auto" src=${Logo}>
    </td>
    <td style='padding-left: 20px; margin-top: 20px; border-left: 2px solid #000; display:inline-block;'>
      <span
        style='
          font-weight: bold;
          padding-left: "";
          text-indent: "0pt";
          text-align: "left";
          margin-bottom: "-5px";
          line-height: 0.5;
          font-size: 1.2rem;
        '
      >
        ${user.FirstName} ${user.LastName} <i style="font-weight: normal;">${user.title}</i>
      </span>
      <br/>
      <br/>
      <span style='line-height: 0.5;'>
        <span className="s9">M: </span>
        <a style='display : inline-block;'
          href="tel:${user.contact}"
          target="_blank"
        >
        ${user.contact}
        </a>
        <span style="padding-left: 5px;">${' • '}</span>
        <a href="" target="_blank">
        ${user.email}
        </a>
      </span>
      <br/>
      <span
        className="s11"
        style='
          padding-top: "10pt";
          padding-left: "";
          line-height: 0.5;
          text-indent: "0pt";
          text-align: "left";
          color: #08495F;
        '
      >
        ENVIRONMENTAL FIELD SERVICES &amp; EHS CONSULTING
      </span>
      <br/>
      <span
        className="s12"
        style='
          padding-left: "";
          text-indent: "0pt";
          text-align: "left";
          line-height: 0.5;
          color: #36CACF;
        '
      >
        A Minority Owned, Arizona Company
      </span>
    </td>
  </tr>
</tbody>
</table>
`;
};

export const getMailBodyHTMLOld = (estimateData: any) => {

  console.log("getMailBodyHTML", estimateData);

  return `
  Hello ${estimateData?.contact?.fullName},
  <br><br>

  Please find the attached Quote for ${estimateData.referenceNumber}.
  <br><br>

  <img src="${backendUrl(estimateData.userId.signature)}" alt="signature" width="50" height="40"/>
  <table style="border:none;" cellSpacing={0} cellPadding={0}>
<tbody>
  <tr>
    <td style={{ paddingRight: "20px"}}>
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
        ${estimateData.userId.FirstName} ${estimateData.userId.LastName} <i>${estimateData.userId.role}</i>
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
          480-529-9177 •
        </a>
        <a href={} target="_blank">
        ${estimateData.userId.email}
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
</table>
`;
};

export const getWorkOrders = (workList) => {
  if (!workList.length) return;
  return workList.map((orderItem) => ({
    WONumber: orderItem.Number,
    PONumber: orderItem.PoNumber,
    Id: orderItem.Id,
  }));
};


export const backendUrl = (str) => {
  return urlJoin(BACKEND_BASE_URL, str)
}
export const timezoneDateRequiredFormat = (date: string, userTimeZone: string) => {
  return date ? moment(date).tz(userTimeZone ? userTimeZone : 'America/Phoenix' ).format("YYYY-MM-DD") : ''
}

export const timezoneDateConverterForFileName = (date: string, userTimeZone: string) => {
  return date ? moment(date).tz(userTimeZone ? userTimeZone : 'America/Phoenix' ).format("YYYY-MM-DD") : ''
}

export const timezoneDateConverter = (date: string, userTimeZone: string) => {
  return date ? moment(date).tz(userTimeZone ? userTimeZone : 'America/Phoenix' ).format("MM/DD/YYYY") : ''
}
export const timezoneTimeConverter = (dateTime: string, userTimeZone: string) => {
  return dateTime ? `${moment(dateTime).tz(userTimeZone ? userTimeZone : 'America/Phoenix' ).format("hh:mm A")}` : ''
}

export const timezoneConverter = (date: string, userTimeZone?: string) => {
  return date ? `${moment(date).tz(userTimeZone ? userTimeZone : 'America/Phoenix' ).format("MM/DD/YYYY hh:mm A")}` : ''
}

export const DateTimeWithtimezoneConverter = (date: string, userTimeZone: string) => {
  return date ? `${moment(date).tz(userTimeZone ? userTimeZone : 'America/Phoenix' ).format("MM/DD/YYYY hh:mm A")} (${userTimeZone ? userTimeZone : 'America/Phoenix'})` : ''
}

export const UTCTimeZoneConverter = (date: string, userTimeZone: string) => {
  return moment.tz(date, userTimeZone).tz('UTC')
}

export  const currencyConverter = (number : string | number) => {
   return number?.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export const timeZoneConvertForInput = (date: string, userTimeZone?: string) => {
  return date ? `${moment(date).tz(userTimeZone ? userTimeZone : 'America/Phoenix' ).format("YYYY-MM-DDTHH:mm:ss")}` : ''
}