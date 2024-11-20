var pdf = new PDFObject({
    url: "/assets/Hirata_Resume.pdf",
    id: "pdfRendered",
    pdfOpenParams: {
      view: "FitH"
    }
  }).embed("pdfRenderer");  