<template>
  <v-container fluid>
    <v-card style="padding: 20px;">
      <v-row>
        <v-col md="5">
          <v-toolbar class="docversiontoolbar">
            <p>Document Versions</p>
            <v-spacer></v-spacer>
            <v-btn small @click="Comparesection">Compare</v-btn>
          </v-toolbar>

          <div v-for="version in versionslist" :key="version.id" @click="getversiondetail(version)">
            <VersionCard :version="version" />
          </div>

          <div v-if="versiondeatilshow" style="border: 1px solid #e3e2e2; margin-top: 20px;">
            <v-toolbar style="background-color: #EBECF1;">
              <p>Version Details</p>
              <v-spacer></v-spacer>
              <p> View Details -></p>
            </v-toolbar>
            <v-simple-table fixed-header style="background-color: #EBECF1;">
              <template v-slot:default>
                <tbody>
                  <tr>
                    <td>Name</td>
                    <td style="text-align: right;">{{ versiondetail.Name }}</td>
                  </tr>
                  <tr>
                    <td>Created</td>
                    <td style="text-align: right;">{{ versiondetail.Created }}</td>
                  </tr>
                  <tr>
                    <td>State</td>
                    <td style="text-align: right;">
                      <v-btn small style="box-shadow: none; border-radius: 18px; padding:2px 10px;"
                        :Class="StatusColor">
                        {{ versiondetail.State }}
                      </v-btn>
                    </td>
                  </tr>
                  <tr>
                    <td>Author</td>
                    <td style="text-align: right;">{{ versiondetail.Author }}</td>
                  </tr>
                  <tr>
                    <td>Changes</td>
                    <td style="text-align: right;">Updated Complience Section based on legal feedback</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>

          <div v-if="showcomparesection" style="border: 1px solid #e3e2e2; padding: 10px; margin-bottom: 10px;">
            <p style="padding: 10px 5px;">Version Comparision</p>
            <div style="background-color: #EBECF1; padding: 10px;">
              <div class="d-flex">
                <div class="StatusDot" style="background-color: green; margin-top: 8px;"></div>
                <span class="dealStageTitle">Added Content</span>
              </div>
              <div class="d-flex">
                <div class="StatusDot" style="background-color: red; margin-top: 8px;"></div>
                <span class="dealStageTitle">Removed Content</span>
              </div>
              <div class="d-flex">
                <div class="StatusDot" style="background-color: yellow; margin-top: 8px;"></div>
                <span class="dealStageTitle">Modified Content</span>
              </div>
            </div>
            <div style="background-color: #EBECF1; padding: 10px;">
              <p style="color: red; margin-bottom: 0px;">- Removed audit requirements from compiliance section</p>
              <p style="color: red; margin-bottom: 0px;">- Removed final authorization process from Approval workflow</p>
              <p style="margin-bottom: 0px;">- Revert Reporting procedures to previous version</p>
            </div>
          </div>

        </v-col>
        <v-col md="7" style="background-color: #EBECF1;">
          <v-toolbar style="box-shadow: none; margin-bottom: 10px;">
            <p>Document Timeline</p>
            <v-spacer></v-spacer>
            <v-btn small style="box-shadow: none;">Reset Timeline</v-btn>
          </v-toolbar>

          <div class="d-flex justify-space-around">
            <v-timeline truncate-line="start" style="width: 400px;">
              <v-timeline-item class="timelineItem">

                <template v-slot:opposite>
                  <v-btn class="showdays">
                    <span>{{ ReviewDays }}Days</span>
                  </v-btn>
                  <span>Document Created</span><br>
                  <span class="docCreateDate"> {{ DocCreatedDate }}</span>
                </template>
              </v-timeline-item>



              <v-timeline-item class="timelineItem">

                <template v-slot:opposite>
                  <v-btn class="showdays">
                    <span>{{ ApprovalDurationDays }}Days</span>
                  </v-btn>
                  <v-btn small class="saveDateBtn" @click="updateDate()">Save</v-btn>
                </template>
                <span style="padding-left: 10px;">Review Phase</span>
                <span class="ProjectFormField-label">Date</span>
                <v-menu ref="menu" v-model="ReviewDatePickerVisible" :close-on-content-click="false"
                  transition="scale-transition" offset-y class="datepickermenu">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="Reviewgdate" placeholder="Date" outlined class="textfield"
                      @click="ReviewDatePickerVisible = true" v-bind="attrs" v-on="on"></v-text-field>
                  </template>
                  <v-date-picker v-model="Reviewgdate" @input=" ReviewDatePickerVisible = false" :width="420"
                    style="font-size: 10px;"></v-date-picker>
                </v-menu>
              </v-timeline-item>

              <v-timeline-item class="timelineItem">
                <template v-slot:opposite>
                  <v-btn class="showdays">
                    <span>{{ PublicationLeadDays }}Days</span>
                  </v-btn>
                  <span>Approval Deadline</span>
                  <v-menu ref="menu" v-model="ApprovalDatePickerVisible" :close-on-content-click="false"
                    transition="scale-transition" offset-y class="datepickermenu">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field v-model="ApprovalDeadlineDate" placeholder="Date" outlined class="textfield"
                        @click="ApprovalDatePickerVisible = true" v-bind="attrs" v-on="on"></v-text-field>
                    </template>
                    <v-date-picker v-model="ApprovalDeadlineDate" @input="ApprovalDatePickerVisible = false"
                      :width="420" style="font-size: 10px;"></v-date-picker>
                  </v-menu>
                </template>
                <v-btn small class="saveDateBtn" @click="updateDate()" style="margin-top: 25px;">Save</v-btn>
              </v-timeline-item>

              <v-timeline-item class="timelineItem">
                <template v-slot:opposite>
                  <v-btn class="showdays">
                    <span>{{ DocumentValidityDays }}Days</span>
                  </v-btn>
                  <v-btn small class="saveDateBtn" @click="updateDate()" style="margin-top: 6px;">Save</v-btn>
                </template>
                <span style="padding-left: 35px;">Publication Date</span>
                <v-menu ref="menu" v-model="PublicationDatePickerVisible" :close-on-content-click="false"
                  transition="scale-transition" offset-y class="datepickermenu">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="PublicationDate" placeholder="Date" outlined class="textfield"
                      @click="PublicationDatePickerVisible = true" v-bind="attrs" v-on="on"></v-text-field>
                  </template>
                  <v-date-picker v-model="PublicationDate" @input="PublicationDatePickerVisible = false" :width="420"
                    style="font-size: 10px;"></v-date-picker>
                </v-menu>
              </v-timeline-item>

              <v-timeline-item class="timelineItem">
                <template v-slot:opposite>
                  <span>Expiration</span>
                  <v-menu ref="menu" v-model="ExpiryDatePickerVisible" :close-on-content-click="false"
                    transition="scale-transition" offset-y class="datepickermenu">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field v-model="ExpiryDate" placeholder="Date" outlined class="textfield"
                        @click="ExpiryDatePickerVisible = true" v-bind="attrs" v-on="on"></v-text-field>
                    </template>
                    <v-date-picker v-model="ExpiryDate" @input="ExpiryDatePickerVisible = false" :width="420"
                      style="font-size: 10px;"></v-date-picker>
                  </v-menu>
                </template>
                <v-btn small class="saveDateBtn" @click="updateDate()" style="margin-top: 25px;">Save</v-btn>
              </v-timeline-item>
            </v-timeline>
          </div>


          <v-card style="padding: 20px;">
            <h3 class="form-subtitle">Timeline Settings</h3>

            <v-row class="my-0">
              <v-col md="6" lg="6" sm="12" class="pt-2 pb-2">
                <span class="FormField-label">Review Duration (Business Days)</span>
                <v-text-field v-model="updateReviewDays" placeholder="Review Duration" outlined
                  class="textfield"></v-text-field>


              </v-col>

              <v-col md="6" lg="6" sm="12" class="pt-2 pb-2">
                <span class="FormField-label">Approval Duration (Business Days)</span>
                <v-text-field v-model="updateApprovalDurationDays" placeholder="Enter Approval Duration" outlined
                  class="textfield"></v-text-field>


              </v-col>
            </v-row>

            <v-row class="my-0" style="margin-top: -80px;">
              <v-col md="6" lg="6" sm="12" class="pt-2 pb-2">

                <span class="FormField-label">Publication Lead Time</span>
                <v-text-field v-model="updatePublicationLeadDays" placeholder="Enter Publication Lead Time" outlined
                  class="textfield"></v-text-field>
              </v-col>

              <v-col md="6" lg="6" sm="12" class="pt-2 pb-2">

                <span class="FormField-label">Document Validity (days)</span>
                <v-text-field v-model="updateDocumentValidityDays" placeholder="Enter validity days" outlined
                  class="textfield"></v-text-field>
              </v-col>
            </v-row>
            <v-btn class="recalculateDays" @click="recalculateDays">Recalculate Timeline</v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import VersionCard from './VersionCard.vue'
export default {
  name: 'HelloWorld',

  data() {
    return {
      // Calculatedoctimelinedetail:{

      // },
      showcomparesection: false,
      versiondeatilshow: false,
      ReviewDatePickerVisible: false,
      ApprovalDatePickerVisible: false,
      PublicationDatePickerVisible: false,
      ExpiryDatePickerVisible: false,
      updateReviewDays: null,
      updateApprovalDurationDays: null,
      updatePublicationLeadDays: null,
      updateDocumentValidityDays: null,

      DocCreatedDate: "2025-04-01",
      Reviewgdate: "2025-04-10",
      ApprovalDeadlineDate: "2025-04-20",
      PublicationDate: "2025-04-30",
      ExpiryDate: "2025-05-01",

      updateExpirydate: null,
      updatePublicationDate: null,
      updateReviewgdate: null,
      updateDocCreatedDate: null,
      updateApprovalDeadlineDate: null,
      versionslist: [
        {
          Name: "Version 1.0",
          Created: "Mar 10,2025",
          State: "Approved",
          Author: "Kathrin Farnandes",
        },
        {
          Name: "Version 2.0",
          Created: "Mar 15,2025",
          State: "In Review",
          Author: "Mylie Cyrus"
        },
        {
          Name: "Version 3.0",
          Created: "Mar 20,2025",
          State: "In Review",
          Author: "Joe Jonas"
        },
        {
          Name: "Version 4.0",
          Created: "Mar 27,2025",
          State: "Draft",
          Author: "Nick Jonas"
        },
        {
          Name: "Version 5.0",
          Created: "Apr 1,2025",
          State: "Draft",
          Author: "Jane Smith"
        },
      ],
      versiondetail: {}
    }
  },
  methods: {
    // setDateTask() {
    //   let SelectedDate = null;

    //   if (this.Meetingdate) {
    //     SelectedDate = this.Meetingdate;
    //   } else if (this.Visitdate) {
    //     SelectedDate = this.Visitdate;
    //   } else if (this.UploadDrawingdate) {
    //     SelectedDate = this.UploadDrawingdate;
    //   }

    //   if (!SelectedDate) return null; // Return null if no date is selected

    //   let months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    //   const chars = SelectedDate.split("-");

    //   let monthRec = chars[1].split("");
    //   let monthName = "";

    //   if (monthRec[0] === "0") {
    //     monthName = monthRec[1];
    //   } else {
    //     monthName = monthRec[0] + monthRec[1];
    //   }

    //   return `${chars[2]}-${months[parseInt(monthName) - 1]}-${chars[0]}`;
    // }
    Comparesection() {
      this.showcomparesection = true;
    },
    recalculateDays() {

      this.ReviewDays = this.updateReviewDays;
      this.ApprovalDurationDays = this.updateApprovalDurationDays;
      this.PublicationLeadDays = this.updatePublicationLeadDays;
      this.DocumentValidityDays = this.updateDocumentValidityDays;
    },
    getversiondetail(version) {
      console.log("version", version)
      this.versiondetail = version;
      console.log("versiondetail", this.versiondetail)
      this.versiondeatilshow = true;

    },
    getDocCreatedDate() {
      let newDocCreatedDate = this.DocCreatedDate.split("-");
      this.updateDocCreatedDate = newDocCreatedDate[2]
      console.log("newDocCreatedDate", newDocCreatedDate)
      console.log("updatedate", this.updateDocCreatedDate)

    },
    getReviewDate() {
      let newReviewgdate = this.Reviewgdate.split("-");
      this.updateReviewgdate = newReviewgdate[2]
      console.log("newReviewgdate", newReviewgdate)
      console.log("updatedate", this.updateReviewgdate)

    },
    getApprovalDate() {
      let newApprovalDeadlineDate = this.ApprovalDeadlineDate.split("-");
      this.updateApprovalDeadlineDate = newApprovalDeadlineDate[2]
      console.log("newReviewgdate", newApprovalDeadlineDate)
      console.log("updatedate", this.updateApprovalDeadlineDate)

    },
    getPublicationDate() {
      let newPublicationDate = this.PublicationDate.split("-");
      this.updatePublicationDate = newPublicationDate[2]
      console.log("newPublicationDate", newPublicationDate)
      console.log("updatedate", this.updatePublicationDate)

    },
    getExpiryDate() {
      let newExpiryDate = this.ExpiryDate.split("-");
      this.updateExpirydate = newExpiryDate[2]
      console.log("newExpiryDate", newExpiryDate)
      console.log("updatedate", this.updateExpirydate)

    },
    updateDate() {
      this.getDocCreatedDate();
      this.getReviewDate();
      this.getApprovalDate();
      this.getPublicationDate();
      this.getExpiryDate();
    },
    updatedays() {
      this.updateReviewDays = this.ReviewDays;
      this.updateApprovalDurationDays = this.ApprovalDurationDays;
      this.updatePublicationLeadDays = this.PublicationLeadDays;
      this.updateDocumentValidityDays = this.DocumentValidityDays;
    }
  },
  components: {
    VersionCard
  },
  computed: {
    ReviewDays() {
      if (this.updateReviewgdate < this.updateDocCreatedDate) {
        return this.updateDocCreatedDate - this.updateReviewgdate;
      } else if (this.updateReviewDays) {
        return this.updateReviewDays;
      }
      return this.updateReviewgdate - this.updateDocCreatedDate;
    },
    ApprovalDurationDays() {
      if (this.updateApprovalDeadlineDate < this.updateReviewgdate) {
        return this.updateReviewgdate - this.updateDocCreatedDate;
      } else if (this.updateApprovalDurationDays) {
        return this.updateApprovalDurationDays;
      }
      return this.updateApprovalDeadlineDate - this.updateReviewgdate;
    },
    PublicationLeadDays() {
      if (this.updatePublicationDate < this.updateApprovalDeadlineDate) {
        return this.updateApprovalDeadlineDate - this.updatePublicationDate;
      } else if (this.updatePublicationLeadDays) {
        return this.updatePublicationLeadDays;
      }
      return this.updatePublicationDate - this.updateApprovalDeadlineDate;
    },
    DocumentValidityDays() {
      if (this.updateExpirydate < this.updatePublicationDate) {
        return this.updatePublicationDate - this.updateExpirydate;
      } else if (this.updateDocumentValidityDays) {
        return this.updateDocumentValidityDays;
      }
      return this.updateExpirydate - this.updatePublicationDate;
    },

    StatusColor() {
      if (this.versiondetail.State == "Approved") {
        return "ActiveStatus";
      } else if (this.versiondetail.State == "In Review") {
        return "InreviewStatus";
      } else if (this.versiondetail.State == "Draft") {
        return "DraftStatus";
      }
      return ""
    }


  },
  created() {
    this.updateDate();
    this.updatedays();
    // localStorage.setItem("Calculatedoctimelinedetail");
    // localStorage.getItem("Calculatedoctimelinedetail");
  },

}
</script>
<style>
.StatusDot {
  width: 8px;
  height: 8px;
  border-radius: 50px;
  margin-right: 5px;
}

.v-sheet.v-toolbar:not(.v-sheet--outlined) {
  box-shadow: none !important;
}

td {
  border-bottom: none !important;
}

.docversiontoolbar {
  box-shadow: none;
  border: 1px solid grey;
  margin-bottom: 10px;
}

.recalculateDays {
  width: 100%;
  background-color: #1976d2 !important;
  color: #FFF;
}

.FormField-label {
  font-size: 14px;
  color: #5E5E5E;
}

.v-text-field--filled>.v-input__control>.v-input__slot,
.v-text-field--full-width>.v-input__control>.v-input__slot,
.v-text-field--outlined>.v-input__control>.v-input__slot {
  align-items: stretch;
  min-height: 42px;
}

.textfield {
  border-radius: 10px;
  margin-bottom: 10px !important;
}

.saveDateBtn {
  background-color: #c1d3ea !important;
}

.docCreateDate {
  color: grey;
}

.timelineItem {
  position: relative;
  height: 100px;
}

.showdays {
  position: absolute;
  right: 0;
  bottom: 0;
  box-shadow: none;
}
</style>
