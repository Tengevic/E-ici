import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-test-pdf-print",
  templateUrl: "./test-pdf-print.component.html",
  styleUrls: ["./test-pdf-print.component.css"],
})
export class TestPdfPrintComponent implements OnInit {
  public elementType = "svg";
  public format = "CODE39";
  public lineColor = "#000000";
  public width = 1;
  public height = 50;
  public displayValue = true;
  public fontOptions = "";
  public font = "monospace";
  public textAlign = "center";
  public textPosition = "bottom";
  public textMargin = 2;
  public fontSize = 20;
  public background = "#ffffff";
  public margin = 10;
  public marginTop = 10;
  public marginBottom = 10;
  public marginLeft = 10;
  public marginRight = 10;
  public display: false;
  @Input() public order;

  constructor() {}

  ngOnInit() {}
}
