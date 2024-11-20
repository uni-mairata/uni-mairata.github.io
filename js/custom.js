var pdf = new PDFObject({
    url: "/assets/Hirata_Resume.pdf",
    id: "resume-render",
    pdfOpenParams: {
      view: "FitH"
    }
  }).embed("resume-render");  