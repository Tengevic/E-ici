import { Component, OnInit, Input } from '@angular/core';

import { take } from 'rxjs/operators';
import * as Moment from 'moment';

import { ObsResourceService } from 'src/app/openmrs-api/obs-resource.service';
import { UserService } from 'src/app/openmrs-api/user.service';

@Component({
  selector: 'app-imaging-comments',
  templateUrl: './imaging-comments.component.html',
  styleUrls: ['./imaging-comments.component.css']
})
export class ImagingCommentsComponent implements OnInit {
  @Input() imagingComments: any;
  public imageReportFindingsText: any;

  constructor(
    private obsResourceService: ObsResourceService,
    private userService: UserService
  ) { }

  ngOnInit() {
  }
  public addComments(imagingComments) {
    console.log(imagingComments);
    // create obs payload
  const obsPayload = {
    groupMembers: [
      {
        concept: '5087a77a-6051-4f1b-9f67-879e3ce2f316',
        obsDatetime: this.toDateString(new Date()),
        person: imagingComments[0].person.uuid,
        value: this.imageReportFindingsText
        // comment: this.imageReportFindingsText
      }
        ]
      };
    // add comments
    this.saveComment(imagingComments[0].obsGroup.uuid, obsPayload);
  }
  public saveComment(uuid, obsPayload) {
    const obsValue = this.imageReportFindingsText;
    this.obsResourceService.updateObs(uuid, obsPayload).pipe(take(1)).subscribe(
      (success) => {
        this.imagingComments.push(
          {
            auditInfo: {
              creator: {
                display: this.userService.getLoggedInUser().display
              },
              dateCreated: success.obsDatetime
            } ,
           value: obsValue
          }
        );
        this.imageReportFindingsText = '';
      });
  }
  private toDateString(date: Date): string {
    return Moment(date).utcOffset('+03:00').format();
  }
}
