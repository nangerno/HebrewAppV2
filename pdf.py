from spire.pdf import *
from spire.pdf.common import *
pdf = PdfDocument()
pdf.LoadFromFile("complete.pdf")
page = pdf.Pages.get_Item(0)
replacer = PdfTextReplacer(page)
replacer.ReplaceText("Evaluation Warning: The document was created with Spire.Doc for Python.", "")
pdf.SaveToFile("one.pdf")
pdf.Close()