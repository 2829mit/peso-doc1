import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  UnderlineType,
  VerticalAlign,
} from "docx";
import FileSaver from "file-saver";
import { DocumentData } from "../types";

// Robustly handle file-saver import (CommonJS vs ESM default)
// @ts-ignore
const saveAs = FileSaver.saveAs || FileSaver;

const FONT_FAMILY = "Times New Roman";
const FONT_SIZE = 24; // 12pt

const createHeaderDate = (address: string, date: string) => {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 60, type: WidthType.PERCENTAGE },
            children: address.split('\n').map(line => new Paragraph({
              children: [new TextRun({ text: line, font: FONT_FAMILY, size: FONT_SIZE })]
            })),
          }),
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.TOP,
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [new TextRun({ text: `Date: ${date}`, font: FONT_FAMILY, size: FONT_SIZE })]
              })
            ],
          }),
        ],
      }),
    ],
  });
};

const createSignatoryBlock = (data: DocumentData) => {
    return [
        new Paragraph({ spacing: { before: 400 }, children: [new TextRun({ text: "Authorized Signatory", bold: true, font: FONT_FAMILY, size: FONT_SIZE })] }),
        new Paragraph({ children: [new TextRun({ text: `NAME: ${data.authPersonName || "____________________"}`, font: FONT_FAMILY, size: FONT_SIZE })] }),
        new Paragraph({ children: [new TextRun({ text: `DESIGNATION: ${data.authPersonDesignation || "____________________"}`, font: FONT_FAMILY, size: FONT_SIZE })] }),
        new Paragraph({ 
            spacing: { before: 200 },
            children: [new TextRun({ text: "STAMP & SIGNATURE", size: FONT_SIZE, font: FONT_FAMILY })]
        })
    ];
};

export const generateDocument = async (data: DocumentData) => {
  // --- Page 1 ---
  const page1 = [
    createHeaderDate(data.circleOfficeAddress || "To,\n(Address of respective circle office)", data.date),
    new Paragraph({ text: "", spacing: { before: 200 } }),
    new Paragraph({
      children: [new TextRun({ text: "Sub: Declaration of Authorized signatory", bold: true, underline: { type: UnderlineType.SINGLE }, font: FONT_FAMILY, size: FONT_SIZE })]
    }),
    new Paragraph({
      spacing: { before: 200 },
      children: [new TextRun({ text: "Dear Sir,", font: FONT_FAMILY, size: FONT_SIZE })]
    }),
    new Paragraph({
      spacing: { before: 200, after: 400 },
      alignment: AlignmentType.JUSTIFIED,
      children: [
        new TextRun({ text: "We, hereby declare that Mr. ", font: FONT_FAMILY, size: FONT_SIZE }),
        new TextRun({ text: data.authPersonName, bold: true, font: FONT_FAMILY, size: FONT_SIZE }),
        new TextRun({ text: " is authorized representative of M/S. ", font: FONT_FAMILY, size: FONT_SIZE }),
        new TextRun({ text: data.companyName, bold: true, font: FONT_FAMILY, size: FONT_SIZE }),
        new TextRun({ text: " and have the authority to sign all necessary documents on behalf of the company as and when required.", font: FONT_FAMILY, size: FONT_SIZE }),
      ]
    }),
    ...createSignatoryBlock(data),
    new Paragraph({
      spacing: { before: 600 },
      children: [new TextRun({ text: "COMPANY PARTNERS / DIRECTORS: -", bold: true, font: FONT_FAMILY, size: FONT_SIZE })]
    }),
    ...data.partners.map((p, i) => new Paragraph({
        spacing: { before: 400 },
        children: [
            new TextRun({ text: `${i + 1}) ${p.name || ''} (${p.designation || ''})`, font: FONT_FAMILY, size: FONT_SIZE }),
            new TextRun({ text: "\t\t----------SIGN-------------------", font: FONT_FAMILY, size: 20 })
        ],
        tabStops: [{ type: "right", position: 9000 }] 
    })),
    new Paragraph({ children: [], pageBreakBefore: true }) 
  ];

  // --- Page 2 ---
  const page2 = [
    new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: `Date: - ${data.date}`, font: FONT_FAMILY, size: FONT_SIZE })]
    }),
    new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200 },
        children: [new TextRun({ text: "Undertaking by Legal Authority", bold: true, font: FONT_FAMILY, size: FONT_SIZE })]
    }),
    new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "(For Prior Approval for storage of Petroleum)", font: FONT_FAMILY, size: FONT_SIZE })]
    }),
    new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { before: 400, after: 400 },
        children: [new TextRun({ text: "We/ I hereby confirm that the site where details are given below is under our/my legal/authorized possession and have clear right to use the same for storage of Petroleum and we/I further declare that no court case or other legal proceedings are under way in any Court of Law in respect of the said site/Land.", font: FONT_FAMILY, size: FONT_SIZE })]
    }),
    new Paragraph({
        children: [new TextRun({ text: "Details of the site: -", bold: true, underline: { type: UnderlineType.SINGLE }, font: FONT_FAMILY, size: FONT_SIZE })]
    }),
    new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE } },
        rows: [
            ["KHASRA NO:-", data.surveyNo],
            ["Village :-", data.villageName],
            ["Taluka:-", data.district],
            ["STATE:-", data.state],
            ["PINCODE:-", data.pinCode],
            ["POLICE STATION:-", data.policeStationName]
        ].map(([label, value]) => new TableRow({
            children: [
                new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, font: FONT_FAMILY, size: FONT_SIZE })] })] }),
                new TableCell({ width: { size: 70, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: value, font: FONT_FAMILY, size: FONT_SIZE })] })] })
            ]
        }))
    }),
    new Paragraph({ spacing: { before: 400 }, children: [new TextRun({ text: "Thanking You,", font: FONT_FAMILY, size: FONT_SIZE })] }),
    ...createSignatoryBlock(data),
    new Paragraph({ children: [], pageBreakBefore: true })
  ];

  // --- Page 3: Authorization Letter ---
  const page3 = [
    createHeaderDate(data.circleOfficeAddress || "To,\n(Address of respective circle office)", data.date),
    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "Sub: Authorization Letter", bold: true, underline: { type: UnderlineType.SINGLE }, font: FONT_FAMILY, size: FONT_SIZE })] }),
    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "Dear Sir,", font: FONT_FAMILY, size: FONT_SIZE })] }),
    new Paragraph({ spacing: { before: 200 }, alignment: AlignmentType.JUSTIFIED, children: [new TextRun({ text: "We hereby authorize Mr. Shailesh Khochare (Repos - Senior Associate Product Licensing) for Submit license document, technical discussion and signed of CCOE documentation from office on behalf of me.", font: FONT_FAMILY, size: FONT_SIZE })] }),
    new Paragraph({ spacing: { before: 400 }, children: [new TextRun({ text: "Specimen Signature,", font: FONT_FAMILY, size: FONT_SIZE })] }),
    new Paragraph({ spacing: { before: 400 }, children: [new TextRun({ text: "(                                    )", font: FONT_FAMILY, size: FONT_SIZE })] }),
    new Paragraph({ children: [new TextRun({ text: "Shailesh Khochare", bold: true, font: FONT_FAMILY, size: FONT_SIZE })] }),
    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "Thanking you,", font: FONT_FAMILY, size: FONT_SIZE })] }),
    new Paragraph({ children: [new TextRun({ text: "Yours truly,", font: FONT_FAMILY, size: FONT_SIZE })] }),
    ...createSignatoryBlock(data),
    new Paragraph({ children: [], pageBreakBefore: true })
  ];

  // --- Page 4: Undertaking for No Schools ---
  const page4 = [
    createHeaderDate(data.circleOfficeAddress || "To,\n(Address of respective circle office)", data.date),
    new Paragraph({ spacing: { before: 200 }, alignment: AlignmentType.JUSTIFIED, children: [new TextRun({ text: "Subject: Undertaking for No Schools, Hospitals, or Residential Areas within 50 Meters of the Proposed aboveground Portable Fuel Station.", bold: true, font: FONT_FAMILY, size: FONT_SIZE })] }),
    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "Dear Sir,", font: FONT_FAMILY, size: FONT_SIZE })] }),
    new Paragraph({ spacing: { before: 200 }, alignment: AlignmentType.JUSTIFIED, children: [new TextRun({ text: "This is to certify that there are no schools, hospitals, or residential premises situated within a 50-meter radius from the boundary of the proposed aboveground Portable Station Services consumer pump facility with a 30KL tank.", font: FONT_FAMILY, size: FONT_SIZE })] }),
    new Paragraph({ spacing: { before: 400 }, children: [new TextRun({ text: "Site Address: ", bold: true, font: FONT_FAMILY, size: FONT_SIZE }), new TextRun({ text: data.siteAddress, font: FONT_FAMILY, size: FONT_SIZE })] }),
    ...createSignatoryBlock(data),
    new Paragraph({ children: [], pageBreakBefore: true })
  ];

  // --- Page 5: Request for issuing... ---
  const page5 = [
    createHeaderDate(data.circleOfficeAddress || "To,\n(Address of respective circle office)", data.date),
    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: `Sub:- Request for issuing aboveground Portable Station Services consumer pump facility with 30KL tank. at ${data.siteAddress}`, bold: true, underline: { type: UnderlineType.SINGLE }, font: FONT_FAMILY, size: FONT_SIZE })] }),
    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "Dear Sir,", font: FONT_FAMILY, size: FONT_SIZE })] }),
    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "M/S. ", font: FONT_FAMILY, size: FONT_SIZE }), new TextRun({ text: data.companyName, bold: true, font: FONT_FAMILY, size: FONT_SIZE }), new TextRun({ text: ` is proposed to install a Portable Service Station at ${data.siteAddress}`, font: FONT_FAMILY, size: FONT_SIZE })] }),
    new Paragraph({ spacing: { before: 200 }, alignment: AlignmentType.JUSTIFIED, children: [new TextRun({ text: "We are anticipating that we will need HSD in bulk to meet our captive requirement of Heavy Earth Moving Equipment and other mining Equipment. We wish to apply for prior approval for the installation of 30 KL Portable Service Station. Please find the attached documents in support of the application.", font: FONT_FAMILY, size: FONT_SIZE })] }),
    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "The list of uploaded documents are: -", bold: true, font: FONT_FAMILY, size: FONT_SIZE })] }),
    ...[
        "Form IX duly filled and signed.",
        "Online Payment Receipt",
        "Layout for the proposed 30KL Portable Service Station installation.",
        "List of Heavy Equipment and Vehicles with registration nos. tank capacity to be engaged in mining works and fueled from the Portable Service Station",
        "Undertaking towards lawful possession of land.",
        "Letter Authorized signatory.",
        "Confirmation from OMC/PMC for Supply letter (LOI)",
        "PAN, GST Certificate & Incorporation Certificate copy.",
        "Registered Land Agreement/7-12",
        "SOP Tank Operation & maintenance",
        "Portable Service station Tank Approved CCOE Letter & Drawing",
        "Undertaking of self-consumption letter"
    ].map((item, i) => new Paragraph({
        children: [new TextRun({ text: `${i + 1}) ${item}`, font: FONT_FAMILY, size: FONT_SIZE })],
        indent: { left: 720 } // Indent list
    })),
    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "We hereby affirm that the information stated above is true and correct to the best of our knowledge.", font: FONT_FAMILY, size: FONT_SIZE })] }),
    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "Thanking You.", font: FONT_FAMILY, size: FONT_SIZE })] }),
    ...createSignatoryBlock(data),
    new Paragraph({ children: [], pageBreakBefore: true })
  ];

  // --- Page 6: List of vehicles ---
  const vehicleRows = data.vehicles.map((v, i) => new TableRow({
      children: [
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: (i + 1).toString(), font: FONT_FAMILY, size: FONT_SIZE })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: v.vehicleNumber, font: FONT_FAMILY, size: FONT_SIZE })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: v.make, font: FONT_FAMILY, size: FONT_SIZE })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: v.model, font: FONT_FAMILY, size: FONT_SIZE })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: v.tankCapacity, font: FONT_FAMILY, size: FONT_SIZE })] })] }),
      ]
  }));
  
  if (data.vehicles.length === 0) {
      vehicleRows.push(new TableRow({ children: [ new TableCell({ columnSpan: 5, children: [new Paragraph("No vehicles listed")] }) ] }));
  }

  // Helper to remove "To," for Page 6 header
  const cleanAddressPage6 = (data.circleOfficeAddress || "").replace(/^To,\s*\n?/i, '').trim();
  const addressParagraphsPage6 = cleanAddressPage6.split('\n').map(line => new Paragraph({
      children: [new TextRun({ text: line, font: FONT_FAMILY, size: FONT_SIZE })]
  }));

  const page6 = [
    new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE } },
        rows: [
            new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "To,", font: FONT_FAMILY, size: FONT_SIZE })] })] }),
                    new TableCell({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `Date: - ${data.date}`, font: FONT_FAMILY, size: FONT_SIZE })] })] })
                ]
            })
        ]
    }),
    ...addressParagraphsPage6,
    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "Sub: - List of the vehicles in our possession for fueling from the Portable Service Station.", bold: true, underline: { type: UnderlineType.SINGLE }, font: FONT_FAMILY, size: FONT_SIZE })] }),
    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "Dear Sir,", font: FONT_FAMILY, size: FONT_SIZE })] }),
    new Paragraph({ spacing: { before: 200, after: 200 }, alignment: AlignmentType.JUSTIFIED, children: [new TextRun({ text: `We are providing a list of the vehicles which are in our possession at our working site engaged in various ${data.businessType} activity at ${data.siteAddress}`, font: FONT_FAMILY, size: FONT_SIZE })] }),
    new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
            new TableRow({
                children: ["Sr. No.", "Vehicle Number", "Make", "Model", "Tank Capacity (LTR)"].map(header => 
                    new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: header, bold: true, font: FONT_FAMILY, size: FONT_SIZE })] })] })
                )
            }),
            ...vehicleRows
        ]
    }),
    ...createSignatoryBlock(data),
    new Paragraph({ children: [], pageBreakBefore: true })
  ];

  // --- Page 7: Issuance of NOC ---
  const page7 = [
    createHeaderDate("To, The Collector and district Magistrate", data.date),
    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "SUB: Issuance of No Objection Certificate for Diesel dispensing storage facility", bold: true, underline: { type: UnderlineType.SINGLE }, font: FONT_FAMILY, size: FONT_SIZE })] }),
    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "Dear Sir,", font: FONT_FAMILY, size: FONT_SIZE })] }),
    new Paragraph({ spacing: { before: 200 }, alignment: AlignmentType.JUSTIFIED, children: [
        new TextRun({ text: "With reference to the subject mentioned above, we propose to establish a diesel dispensing facility at our M/S ", font: FONT_FAMILY, size: FONT_SIZE }),
        new TextRun({ text: data.companyName, bold: true, font: FONT_FAMILY, size: FONT_SIZE }),
        new TextRun({ text: " mining site located at ", font: FONT_FAMILY, size: FONT_SIZE }),
        new TextRun({ text: data.siteAddress, bold: true, font: FONT_FAMILY, size: FONT_SIZE }),
        new TextRun({ text: ". The diesel will be utilized for our own operations across various project activities. We have requested M/S. ", font: FONT_FAMILY, size: FONT_SIZE }),
        new TextRun({ text: data.omcName || "_________________", bold: true, font: FONT_FAMILY, size: FONT_SIZE }),
        new TextRun({ text: ". to supply diesel for this purpose. Additionally, we have already applied for prior approval from the Petroleum and Explosives Safety Organization (PESO), under the Ministry of Industry and Commerce, for the establishment of this facility", font: FONT_FAMILY, size: FONT_SIZE }),
    ] }),
    new Paragraph({ spacing: { before: 200 }, alignment: AlignmentType.JUSTIFIED, children: [new TextRun({ text: "In this regard, we kindly request your esteemed office to grant a No Objection Certificate (NOC) for the installation of a diesel storage and dispensing facility at the aforementioned site. For your reference, the following documents have been enclosed with this request letter:", font: FONT_FAMILY, size: FONT_SIZE })] }),
    ...[
        "Copies of drawings",
        "Copy of the letter submitted to OMC requesting the supply of diesel",
        "Copy of the Letter of Intent issued by OMC for diesel supply",
        "Land documents"
    ].map(item => new Paragraph({
        bullet: { level: 0 },
        children: [new TextRun({ text: item, font: FONT_FAMILY, size: FONT_SIZE })]
    })),
    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "In view of the above, we hereby confirm that the facility will be operated only after obtaining the necessary license from the competent authorities authorized to issue the same.", font: FONT_FAMILY, size: FONT_SIZE })] }),
    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "We appreciate your consideration and look forward to your approval", font: FONT_FAMILY, size: FONT_SIZE })] }),
    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "Yours faithfully,", font: FONT_FAMILY, size: FONT_SIZE })] }),
    ...createSignatoryBlock(data),
    new Paragraph({ children: [], pageBreakBefore: true })
  ];

  // --- Page 8: SOP ---
  const page8 = [
      createHeaderDate("SOP", data.date),
      new Paragraph({ spacing: { before: 200 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "TANK OPERATION AND MAINTENANCE SOP", bold: true, font: FONT_FAMILY, size: FONT_SIZE })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Decantation from tank truck and tank loading SOP", bold: true, font: FONT_FAMILY, size: FONT_SIZE })] }),
      ...[
          "Park the tank truck in the loading area in the drive out positon and secure the wheels with the help of wheel chock.",
          "Allow 10 minutes settings time",
          "Check the product level inside the portable service station using the dip stick",
          "Switch off the vehicle and master switch",
          "Check condition of the seal / security lock on the tank",
          "Keep the valid fire extinguisher ready in an easily accessible positon for emergency near vehicles.",
          "Connect the bonding reel clip",
          "Security connects the decantation hose with the loading points of the portable service station",
          "Check that the density @ 15 degree C using ASTM tables is within +/- 3.0 kg/M3 as compared with the challan density for ascertaining quality of product.",
          "Check weights & Measures markings on the dip rod at the bottom as well as at the proof level",
          "Check dips of the product in all compartments with the dip rod duly certified by weights & measurements department and provides with the POL tank. Also check for presence of water in each compartment by water finding paste. Before commencing POL tank decantation operation, the dispensing should be stopped till the completion of decantation.",
          "Release master valve levers to ensure product fills the pipelines.",
          "Start suction system of the product to initiate the filling of the portable service station tank.",
          "Stop suction system when the portable tank is completely filled",
          "After decanting the product ensure that the tank truck is fully emptied of the product before releasing the TT tank.",
          "Remove the decantation hose and keep the hose safety to it original positon",
          "Upon completion of the decantation check the level in the portable service station tank with the help of the dip stick",
          "Remove bounding reel clip and keep the extinguisher in its original positon.",
          "No dispensing / Fuelling opration are permitted during the decantation"
      ].map((item, i) => new Paragraph({
          children: [new TextRun({ text: `${i + 1}) ${item}`, font: FONT_FAMILY, size: FONT_SIZE })],
          spacing: { before: 100 },
          indent: { left: 720, hanging: 360 }
      })),
      new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "Thanking You.", font: FONT_FAMILY, size: FONT_SIZE })] }),
      ...createSignatoryBlock(data),
      new Paragraph({ children: [], pageBreakBefore: true })
  ];

  // --- Page 9: Proforma for NOC ---
  const page9 = [
      new Paragraph({ children: [new TextRun({ text: "Proforma for NOC by District Authority: ( Ref the Gazette Notification)", bold: true, font: FONT_FAMILY, size: FONT_SIZE })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200 }, children: [new TextRun({ text: "Proforma", bold: true, font: FONT_FAMILY, size: FONT_SIZE })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "No Objection Certificate", bold: true, font: FONT_FAMILY, size: FONT_SIZE })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[See rule 144]", bold: true, font: FONT_FAMILY, size: FONT_SIZE })] }),
      new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE } },
          rows: [new TableRow({ children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "No…………….", font: FONT_FAMILY, size: FONT_SIZE })] })] }),
              new TableCell({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `Date: ${data.date}`, font: FONT_FAMILY, size: FONT_SIZE })] })] })
          ] })]
      }),
      new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "Subject: No objection certificate", bold: true, font: FONT_FAMILY, size: FONT_SIZE })] }),
      new Paragraph({ spacing: { before: 200 }, alignment: AlignmentType.JUSTIFIED, children: [
          new TextRun({ text: "With reference to the application No.……. dated …….. submitted by………….and in pursuance of rule 144 of the Petroleum Rules, 2002, there is no objection for granting licence under the Petroleum Rules, 2002 to ", font: FONT_FAMILY, size: FONT_SIZE }),
          new TextRun({ text: `M/S. ${data.companyName}`, bold: true, font: FONT_FAMILY, size: FONT_SIZE }),
          new TextRun({ text: ` address `, font: FONT_FAMILY, size: FONT_SIZE }),
          new TextRun({ text: data.businessAddress || "(Business Address)", bold: true, font: FONT_FAMILY, size: FONT_SIZE }),
          new TextRun({ text: ` for storage of petroleum products in their premises at `, font: FONT_FAMILY, size: FONT_SIZE }),
          new TextRun({ text: data.siteAddress, bold: true, font: FONT_FAMILY, size: FONT_SIZE }),
          new TextRun({ text: " as shown in the site plan duly endorsed and enclosed herewith.", font: FONT_FAMILY, size: FONT_SIZE })
      ] }),
      new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "(1) The following particulars have been considered while issuing this no objection certificate, that-", font: FONT_FAMILY, size: FONT_SIZE })] }),
      ...[
          "(a) possession of the site by the applicant is lawful and authorisation from land owner or lease holder for developing premises under these rules for storage of petroleum products;",
          "(b) interest of public, specially the facilities like schools, hospitals or proximity to places of public assembly and the mitigating measures, if any, is provided;",
          "(c) traffic density and impact on traffic;",
          "(d) conformity of proposal to the local or area development planning;",
          "(e) accessibility of the site to fire tenders in case of emergency and preparedness of fire services for combating the emergencies;",
          "(f) genuineness of purpose.",
          "(g) any other matter pertinent to public safety;"
      ].map(text => new Paragraph({ indent: { left: 720 }, children: [new TextRun({ text, font: FONT_FAMILY, size: FONT_SIZE })] })),
      new Paragraph({ spacing: { before: 800 }, indent: { left: 3000 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Signature of the district authority issuing no objection certificate with his office seal (in towns having a Commissioner of Police, the Commissioner or a Deputy Commissioner of Police and for any other place the District Magistrate)", font: FONT_FAMILY, size: 20 })] }),
      new Paragraph({ spacing: { before: 400 }, border: { top: { style: BorderStyle.SINGLE, size: 1, space: 1 } }, children: [new TextRun({ text: "Note.- The licensing authority shall accept the no objection certificate within a period of three years from the date of its issue for considering grant of licence.", italics: true, font: FONT_FAMILY, size: 20 })] }),
      new Paragraph({ spacing: { before: 400 }, children: [new TextRun({ text: "Thanking You.", font: FONT_FAMILY, size: FONT_SIZE })] }),
      ...createSignatoryBlock(data)
  ];

  // --- Page 10: Self Declaration ---
  const page10 = [
    createHeaderDate(data.circleOfficeAddress || "To,\n(Address of respective circle office)", data.date),
    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "Sub:- Self Declaration for consumption of fuel", bold: true, underline: { type: UnderlineType.SINGLE }, font: FONT_FAMILY, size: FONT_SIZE })] }),
    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "Dear Sir,", font: FONT_FAMILY, size: FONT_SIZE })] }),
    new Paragraph({ 
        spacing: { before: 200 }, 
        alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "We wish to inform that the fuel is required for the self-consumption purpose in to our heavy vehicles and equipment and site details for the installation is as follows:", font: FONT_FAMILY, size: FONT_SIZE })] 
    }),
    new Paragraph({ 
        spacing: { before: 400 }, 
        children: [
            new TextRun({ text: "Name: ", bold: true, font: FONT_FAMILY, size: FONT_SIZE }),
            new TextRun({ text: data.companyName, font: FONT_FAMILY, size: FONT_SIZE })
        ] 
    }),
    new Paragraph({ 
        spacing: { before: 200 }, 
        children: [
            new TextRun({ text: "Address: ", bold: true, font: FONT_FAMILY, size: FONT_SIZE }),
            // Handle multiline address nicely
            ...data.siteAddress.split('\n').flatMap((line, i) => [
                i > 0 ? new TextRun({ text: "", break: 1 }) : null,
                new TextRun({ text: line, font: FONT_FAMILY, size: FONT_SIZE })
            ]).filter((x): x is TextRun => x !== null)
        ] 
    }),
    new Paragraph({ spacing: { before: 400 }, children: [new TextRun({ text: "Thanking You.", font: FONT_FAMILY, size: FONT_SIZE })] }),
    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "Yours faithfully,", font: FONT_FAMILY, size: FONT_SIZE })] }),
    ...createSignatoryBlock(data)
  ];

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
          ...page1,
          ...page2,
          ...page3,
          ...page4,
          ...page5,
          ...page6,
          ...page7,
          ...page8,
          ...page9,
          ...page10
      ]
    }]
  });

  const blob = await Packer.toBlob(doc);
  const fileName = `${data.companyName.replace(/\s+/g, '_') || "Document"}_PESO.docx`;
  // Call the resolved saveAs function
  saveAs(blob, fileName);
};