<template>
  <v-container fluid>
    <v-card style="padding: 20px;">
      <v-row>
        <v-col md="5">

          <v-row style="padding: 10px 0px;">
            <v-col md="7">
              <p>Document Versions</p>
            </v-col>
            <v-col md="5">
              <div style="text-align: right;">
                <div style="display: flex; justify-content: right;" v-if="showcompareBtn">
                  <v-btn small @click="ShowComparison" style="background-color: #1976d2; color:white;">Compare</v-btn>
                  <v-btn small @click="CancelCompareVersions"
                    style="background-color: #1976d2; margin-left: 5px; color:white;">Cancel</v-btn>
                </div>
                <v-btn v-else small @click="ShowCompareBtns">Compare</v-btn>
              </div>
            </v-col>
          </v-row>

          <div v-for="version in newVersionList" :key="version.id" @click="getversiondetail(version)">
            <VersionCard :version="version" :SelectedVersionid="SelectedVersionid" />
          </div>

          <div v-if="versiondeatilshow" style="border: 1px solid #e3e2e2; margin-top: 20px;">
            <v-toolbar style="background-color: #EBECF1;">
              <p>Version Details</p>
              <v-spacer></v-spacer>
              <v-btn v-if="!showeditfeilds" small @click="OpenEditForm()"> Edit Details -></v-btn>
              <div v-else style="display: flex;">
                <v-btn style="margin-right: 10px;" small @click="SaveEditInfo()"> Save Details</v-btn>
                <v-btn small @click="CancelEditForm()"> Cancel</v-btn>
              </div>
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
                    <td v-if="showeditfeilds" style="justify-items: right;">

                      <!-- <v-menu ref="menu" v-model="ReviewDatePickerVisible" :close-on-content-click="false"
                        transition="scale-transition" offset-y class="datepickermenu">
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field v-model="Reviewgdate" placeholder="Date" outlined class="textfield"
                            @click="ReviewDatePickerVisible = true" v-bind="attrs" v-on="on"></v-text-field>
                        </template>
                        <v-date-picker v-model="Reviewgdate" @input="ReviewDatePickerVisible = false" :width="420"
                          style="font-size: 10px;"></v-date-picker>
                      </v-menu>
                      
                      {{ VersionDatePickerVisible }} -->

                      <v-menu ref="menu" v-model="VersionDatePickerVisible" :close-on-content-click="false"
                        transition="scale-transition" offset-y class="datepickermenu">
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field v-model="updatedCreated" placeholder="Date" outlined class="editfield"
                            @click="VersionDatePickerVisible = true" v-bind="attrs" v-on="on"
                            ></v-text-field>
                        </template>
                        <v-date-picker v-model="updatedCreated" @input="VersionDatePickerVisible = false"></v-date-picker>
                      </v-menu>

                    </td>
                    <td v-else style="text-align: right;">{{ versiondetail.Created }}</td>
                  </tr>
                  <tr>
                    <td>State</td>
                    <td v-if="showeditfeilds" style="justify-items: right;">
                      <!-- <v-text-field v-model="updatedState" outlined class="editfield"></v-text-field> -->
                      <v-select v-model="updatedState" required outlined class="editfield selectfield"
                        :items="VersionStates"></v-select>
                    </td>
                    <td v-else style="text-align: right;">
                      <v-btn small style="box-shadow: none; border-radius: 18px; padding:2px 10px;"
                        :Class="StatusColor">
                        {{ versiondetail.State }}
                      </v-btn>
                    </td>
                  </tr>
                  <tr>
                    <td>Author</td>
                    <td v-if="showeditfeilds" style="justify-items: right;">
                      <v-text-field v-model="updatedAuthor" outlined class="editfield"></v-text-field>
                    </td>
                    <td v-else style="text-align: right;">{{ versiondetail.Author }}</td>
                  </tr>
                  <tr>
                    <td>Changes</td>
                    <td v-if="showeditfeilds" style="justify-items: right;">
                      <v-text-field v-model="editchange" outlined class="editfield">
                      </v-text-field>
                    </td>
                    <td v-else style="text-align: right;">
                      {{ versiondetail.changes }}
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>

          <div v-if="showcomparesection"
            style="border: 1px solid #e3e2e2; padding: 10px; margin-bottom: 10px; margin-top: 20px;">
            <p style="padding: 10px 5px 0px 5px;">Version Comparision</p>
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
                <div class="StatusDot" style="background-color: orange; margin-top: 8px;"></div>
                <span class="dealStageTitle">Modified Content</span>
              </div>
            </div>
            <p style="color: grey; margin:8px 0px">Comparing Version {{ selectedVersionListforcomparision[0].Name }}
              With {{
                selectedVersionListforcomparision[1].Name }}</p>
            <div style="background-color: #EBECF1; padding: 10px; border: 1px solid grey;">

              <p v-if="selectedVersionListforcomparision[0].Name !== selectedVersionListforcomparision[1].Name && selectedVersionListforcomparision[0].Name !== '' && selectedVersionListforcomparision[1].Name !== ''"
                style="margin-bottom: 0px; color: orange; font-size: 12px;">-
                {{ selectedVersionListforcomparision[1].Name }} is Modified version of {{
                  selectedVersionListforcomparision[0].Name }}
              </p>

              <p v-if="selectedVersionListforcomparision[0].Name !== selectedVersionListforcomparision[1].Name && selectedVersionListforcomparision[0].Name == '' && selectedVersionListforcomparision[1].Name !== ''"
                style="margin-bottom: 0px; color: green; font-size: 12px;">-
                Newly added Name version Is {{ selectedVersionListforcomparision[1].Name }}
              </p>

              <p v-if="selectedVersionListforcomparision[0].Name !== selectedVersionListforcomparision[1].Name && selectedVersionListforcomparision[0].Name !== '' && selectedVersionListforcomparision[1].Name == ''"
                style="margin-bottom: 0px; color: red; font-size: 12px;">-
                {{ selectedVersionListforcomparision[0].Name }} version Name Is Removed
              </p>

              <p v-if="selectedVersionListforcomparision[0].Author !== selectedVersionListforcomparision[1].Author && selectedVersionListforcomparision[0].Author !== '' && selectedVersionListforcomparision[1].Author !== ''"
                style="margin-bottom: 0px; color: orange; font-size: 12px;">
                - Author Name has been changed from {{ selectedVersionListforcomparision[0].Author }} to {{
                  selectedVersionListforcomparision[1].Author }}
              </p>

              <p v-if="selectedVersionListforcomparision[0].Author !== selectedVersionListforcomparision[1].Author && selectedVersionListforcomparision[0].Author == '' && selectedVersionListforcomparision[1].Author !== ''"
                style="margin-bottom: 0px; color: green; font-size: 12px;">-
                New Author {{ selectedVersionListforcomparision[1].Author }} has been added to {{
                  selectedVersionListforcomparision[1].Name }}
              </p>

              <p v-if="selectedVersionListforcomparision[0].Author !== selectedVersionListforcomparision[1].Author && selectedVersionListforcomparision[0].Author !== '' && selectedVersionListforcomparision[1].Author == ''"
                style="margin-bottom: 0px; color: red; font-size: 12px;">-
                {{ selectedVersionListforcomparision[0].Author }} Author Name has been Removed from {{
                  selectedVersionListforcomparision[0].Name }}
              </p>

              <p v-if="selectedVersionListforcomparision[0].Created !== selectedVersionListforcomparision[1].Created && selectedVersionListforcomparision[0].Created !== '' && selectedVersionListforcomparision[1].Created !== ''"
                style="margin-bottom: 0px; color: orange; font-size: 12px;">
                - Version Date has been changed from {{ selectedVersionListforcomparision[0].Created }} to {{
                  selectedVersionListforcomparision[1].Created }}
              </p>

              <p v-if="selectedVersionListforcomparision[0].Created !== selectedVersionListforcomparision[1].Created && selectedVersionListforcomparision[0].Created == '' && selectedVersionListforcomparision[1].Created !== ''"
                style="margin-bottom: 0px; color: green; font-size: 12px;">-
                {{ selectedVersionListforcomparision[1].Name }} is Created on {{
                  selectedVersionListforcomparision[1].Created }}
              </p>

              <p v-if="selectedVersionListforcomparision[0].Created !== selectedVersionListforcomparision[1].Created && selectedVersionListforcomparision[0].Created !== '' && selectedVersionListforcomparision[1].Created == ''"
                style="margin-bottom: 0px; color: red; font-size: 12px;">-
                Version Date has been Removed from {{ selectedVersionListforcomparision[1].Name }}
              </p>


              <p v-if="selectedVersionListforcomparision[0].State !== selectedVersionListforcomparision[1].State && selectedVersionListforcomparision[0].State !== '' && selectedVersionListforcomparision[1].State !== ''"
                style="margin-bottom: 0px; color: orange; font-size: 12px;">
                - Status has been changed from {{ selectedVersionListforcomparision[0].State }} to {{
                  selectedVersionListforcomparision[1].State }}
              </p>

              <p v-if="selectedVersionListforcomparision[0].State !== selectedVersionListforcomparision[1].State && selectedVersionListforcomparision[0].State == '' && selectedVersionListforcomparision[1].State !== ''"
                style="margin-bottom: 0px; color: green; font-size: 12px;">-

                Status has been changed from {{ selectedVersionListforcomparision[0].State }} to {{
                  selectedVersionListforcomparision[1].State }}
              </p>

              <p v-if="selectedVersionListforcomparision[0].State !== selectedVersionListforcomparision[1].State && selectedVersionListforcomparision[0].State !== '' && selectedVersionListforcomparision[1].State == ''"
                style="margin-bottom: 0px; color: red; font-size: 12px;">-
                Version State has been Removed from {{ selectedVersionListforcomparision[1].Name }}
              </p>

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
                  <v-btn small class="saveDateBtn" @click="updateDateFromReviewDate()">Save</v-btn>
                </template>
                <span style="padding-left: 10px;">Review Phase</span>
                <span class="ProjectFormField-label">Date</span>
                <v-menu ref="menu" v-model="ReviewDatePickerVisible" :close-on-content-click="false"
                  transition="scale-transition" offset-y class="datepickermenu">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="Reviewgdate" placeholder="Date" outlined class="textfield"
                      @click="ReviewDatePickerVisible = true" v-bind="attrs" v-on="on"></v-text-field>
                  </template>
                  <v-date-picker v-model="Reviewgdate" @input="ReviewDatePickerVisible = false" :width="420"
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
                <v-btn small class="saveDateBtn" @click="updateDateFromApprovalDate()"
                  style="margin-top: 25px;">Save</v-btn>
              </v-timeline-item>

              <v-timeline-item class="timelineItem">
                <template v-slot:opposite>
                  <v-btn class="showdays">
                    <span>{{ DocumentValidityDays }}Days</span>
                  </v-btn>
                  <v-btn small class="saveDateBtn" @click="updateDateFromPublicationDate()"
                    style="margin-top: 6px;">Save</v-btn>
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
                <v-btn small class="saveDateBtn" @click="updateDateFromExpiryDate()"
                  style="margin-top: 25px;">Save</v-btn>
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
import { mapWritableState } from 'pinia';
import { useCounterStore } from '@/store';

export default {
  name: 'HelloWorld',

  data() {
    return {
      // Calculatedoctimelinedetail:{
      // },
      // showcompareBtn:false,

      validDateFormat: [
        v => {
          const regex = /^[A-Z][a-z]{2} \d{2}, \d{4}$/;
          return regex.test(v) || 'Date must be in format: Apr 01, 2025';
        }
      ],

      testDate: null,

      editchange: "",
      updatedName: "",
      updatedCreated: null,
      updatedState: "",
      updatedAuthor: "",

      showeditfeilds: false,
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

      VersionStates: ["Approved", 'In Review', "Draft"],
      VersionDatePickerVisible: false,

      SelectedVersion: false,
      SelectedVersionid: null,

      selectedVersionList: [],
      // selectedVersionListforcomparision: [],

      versionslist: [
        {
          Name: "Version 1.0",
          Created: "Mar 10,2025",
          State: "Approved",
          Author: "Kathrin Farnandes",
          changes: "",
          id: 1
        },
        {
          Name: "Version 2.0",
          Created: "Mar 15,2025",
          State: "In Review",
          Author: "Mylie Cyrus",
          changes: "",
          id: 2
        },
        {
          Name: "Version 3.0",
          Created: "Mar 20,2025",
          State: "In Review",
          Author: "Joe Jonas",
          changes: "",
          id: 3
        },
        {
          Name: "Version 4.0",
          Created: "Mar 27,2025",
          State: "Draft",
          Author: "Nick Jonas",
          changes: "",
          id: 4
        },
        {
          Name: "Version 5.0",
          Created: "2025-04-01",
          State: "Draft",
          Author: "Jane Smith",
          changes: "",
          id: 5
        },
      ],
      versiondetail: {
      },
      newVersionList: null,
      IsSave: false,
      businessdays: null
    }
  },
  methods: {

    OpenEditForm() {
      console.log("versiondetail", this.versiondetail);
      this.updatedName = this.versiondetail.Name;
      this.updatedCreated = this.versiondetail.Created;
      this.updatedState = this.versiondetail.State;
      this.updatedAuthor = this.versiondetail.Author;
      this.editchange = this.versiondetail.changes;
      this.showeditfeilds = true;
    },
    SaveEditInfo() {

      console.log("newVersionList", this.newVersionList)
      // console.log("versiondetail.id",this.versiondetail.id)
      let updatedversion = this.newVersionList.find(version => version.id == this.versiondetail.id)
      console.log("updatedversion", updatedversion.Name)

      updatedversion.Name = this.updatedName;
      updatedversion.Created = this.updatedCreated;
      updatedversion.State = this.updatedState;
      updatedversion.Author = this.updatedAuthor;
      updatedversion.changes = this.editchange;

      console.log("newVersionList", this.newVersionList)
      localStorage.setItem("versionlist", JSON.stringify(this.newVersionList));

      this.showeditfeilds = false;
    },
    ShowCompareBtns() {

      if (this.SelectedVersionid) {
        this.showcompareBtn = true;
      }
    },
    ShowComparison() {
      console.log("selectedVersionListforcomparision 1 ---> ", this.selectedVersionListforcomparision)

      let ExistingSelectedVersion = this.selectedVersionListforcomparision.find((item) => item.id == this.versiondetail.id)
      console.log("ExistingSelectedVersion", ExistingSelectedVersion)
      if (!ExistingSelectedVersion) {
        this.selectedVersionListforcomparision.push(this.versiondetail)
      }
      console.log("selectedVersionListforcomparision 2 ---> ", this.selectedVersionListforcomparision)
      if (this.selectedVersionListforcomparision.length == 2) {
        this.selectedVersionListforcomparision.sort((a, b) => (a.id - b.id))
        console.log("Sorted  selectedVersionListforcomparision", this.selectedVersionListforcomparision)
        this.showcomparesection = true;
      }
    },
    CancelCompareVersions() {
      this.showcomparesection = false;
      this.showcompareBtn = false;
      this.Isversionseleceted.toshow = false;
      this.selectedVersionListforcomparision = [];
    },
    recalculateDays() {
      let docCreatedDate = new Date(this.DocCreatedDate);
      // console.log("docCreatedDate",docCreatedDate)

      if (this.updateReviewDays) {
        let reviewDate = new Date(docCreatedDate);
        // console.log("reviewDate",reviewDate)

        reviewDate.setDate(docCreatedDate.getDate() + parseInt(this.updateReviewDays));

        this.Reviewgdate = reviewDate.toISOString().split('T')[0];
        console.log("formatted Reviewgdate", this.Reviewgdate)
      }

      else if (this.updateApprovalDurationDays) {
        let reviewDate = new Date(this.Reviewgdate);
        // console.log("reviewDate",reviewDate)

        let approvalDate = new Date(reviewDate);
        approvalDate.setDate(reviewDate.getDate() + parseInt(this.updateApprovalDurationDays));

        this.ApprovalDeadlineDate = approvalDate.toISOString().split('T')[0];
        console.log("formatted ApprovalDeadlineDate", this.ApprovalDeadlineDate)
      }

      else if (this.updatePublicationLeadDays) {
        let approvalDate = new Date(this.ApprovalDeadlineDate);
        // console.log("approvalDate",approvalDate)

        let publicationDate = new Date(approvalDate);
        publicationDate.setDate(approvalDate.getDate() + parseInt(this.updatePublicationLeadDays));

        this.PublicationDate = publicationDate.toISOString().split('T')[0];
        console.log("formatted PublicationDate", this.PublicationDate)
      }

      else if (this.updateDocumentValidityDays) {
        let publicationDate = new Date(this.PublicationDate);
        // console.log("publicationDate",publicationDate)

        let expiryDate = new Date(publicationDate);
        expiryDate.setDate(publicationDate.getDate() + parseInt(this.updateDocumentValidityDays));

        this.ExpiryDate = expiryDate.toISOString().split('T')[0];
        console.log("formatted ExpiryDate", this.ExpiryDate)
      } else {
        ""
      }

      this.updateDate();
    },
    getversiondetail(version) {
      console.log("version", version)
      if (this.showcompareBtn == false) {
        this.SelectedVersionid = version.id

        console.log("SelectedVersionid", this.SelectedVersionid)

        this.versiondetail = version;

        console.log("versiondetail", this.versiondetail);
        this.versiondeatilshow = true;

      }

    },
    updateDate() {
      this.IsSave = true;
      let docCreatedDate = new Date(this.DocCreatedDate);
      console.log("docCreatedDate", docCreatedDate)


      let reviewDate = new Date(this.Reviewgdate);
      console.log("reviewDate", reviewDate)

      // this.ApprovalDeadlineDate = approvalDate.toISOString().split('T')[0];
      let approvalDate = new Date(this.ApprovalDeadlineDate);
      console.log("approvalDate", approvalDate)

      // this.PublicationDate = publicationDate.toISOString().split('T')[0];
      let publicationDate = new Date(this.PublicationDate);
      // console.log("publicationDate",publicationDate)

      // this.ExpiryDate = expiryDate.toISOString().split('T')[0];
      // let expiryDate = new Date(this.ExpiryDate);
      // console.log("expiryDate",expiryDate)

      // this.updateReviewDays = (reviewDate - docCreatedDate);
      // console.log("updateReviewDays", this.updateReviewDays)

      if (docCreatedDate && reviewDate) {
        this.getBussinessDays(docCreatedDate, reviewDate);
        console.log("getdays", this.businessdays)
        this.updateReviewDays = Math.round(this.businessdays);
        console.log("updateReviewDays", this.updateReviewDays)
        console.log("f")
      }
      if (reviewDate && approvalDate) {
        this.getBussinessDays(reviewDate, approvalDate);
        console.log("getdays", this.businessdays)
        this.updateApprovalDurationDays = Math.round(this.businessdays);
        console.log("updateApprovalDurationDays", this.updateApprovalDurationDays)
      }
      if (approvalDate && publicationDate) {
        this.getBussinessDays(reviewDate, approvalDate);
        console.log("getdays", this.businessdays)
        this.updatePublicationLeadDays = Math.round(this.businessdays);
        console.log("updatePublicationLeadDays", this.updatePublicationLeadDays)
      }
      if (approvalDate && publicationDate) {
        this.getBussinessDays(approvalDate, publicationDate);
        console.log("getdays", this.businessdays)
        this.updateDocumentValidityDays = Math.round(this.businessdays);
        console.log("updateDocumentValidityDays", this.updateDocumentValidityDays)
      }

    },
    getReviewgdate() {
      let reviewDate = new Date(this.Reviewgdate);
      if (this.updateApprovalDurationDays) {
        let approvalDate = new Date(reviewDate);
        approvalDate.setDate(reviewDate.getDate() + parseInt(this.updateApprovalDurationDays));
        // this.ApprovalDeadlineDate = new Date(approvalDate);
        this.ApprovalDeadlineDate = approvalDate.toISOString().split('T')[0];


      }
    },
    getApprovalDeadlineDate() {
      let approvalDate = new Date(this.ApprovalDeadlineDate);
      if (this.updatePublicationLeadDays) {
        let publicationDate = new Date(approvalDate);
        publicationDate.setDate(approvalDate.getDate() + parseInt(this.updatePublicationLeadDays));
        // this.PublicationDate = new Date(publicationDate);
        this.PublicationDate = publicationDate.toISOString().split('T')[0];

      }

    },
    getPublicationDate() {
      let publicationDate = new Date(this.PublicationDate);
      if (this.updateDocumentValidityDays) {
        let expiryDate = new Date(publicationDate);
        expiryDate.setDate(publicationDate.getDate() + parseInt(this.updateDocumentValidityDays));
        // this.ExpiryDate = new Date(expiryDate);
        this.ExpiryDate = expiryDate.toISOString().split('T')[0];
      }


    },
    getExpiryDate() {
      let expiryDate = new Date(this.ExpiryDate);
      this.ExpiryDate = expiryDate.toISOString().split('T')[0];


    },
    getBussinessDays(start, end) {
      var s = new Date(start);
      var e = new Date(end);
      var addOneMoreDay = 0;
      if (s.getDay() == 0 || s.getDay() == 6) {
        addOneMoreDay = 1;
      }
      console.log(addOneMoreDay)
      let days = 0
      while (s < e) {
        s.setDate(s.getDate() + 1);
        if (s.getDay() != 0 && s.getDay() != 6) {
          ++days;
        }
        this.businessdays = days;
        console.log(this.businessdays)
      }
    },
    updateDateFromReviewDate() {
      this.getReviewgdate();
      this.getApprovalDeadlineDate();
      this.getPublicationDate();
      this.getExpiryDate();
      this.updateDate();
    },
    updateDateFromApprovalDate() {
      this.getApprovalDeadlineDate();
      this.getPublicationDate();
      this.getExpiryDate();
      this.updateDate()
    },
    updateDateFromPublicationDate() {
      this.getPublicationDate();
      this.getExpiryDate();
      this.updateDate()
    },
    updateDateFromExpiryDate() {
      this.getExpiryDate();
      this.updateDate()
    }
  },
  components: {
    VersionCard
  },
  computed: {
    ...mapWritableState(useCounterStore, ['showcompareBtn', 'selectedVersionListforcomparision', 'Isversionseleceted']),
    ReviewDays() {
      return this.updateReviewDays;
    },
    ApprovalDurationDays() {
      return this.updateApprovalDurationDays
    },
    PublicationLeadDays() {
      return this.updatePublicationLeadDays
    },
    DocumentValidityDays() {
      return this.updateDocumentValidityDays
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
  watch: {
    // Reviewgdate(newDate) {
    //   let reviewDate = new Date(newDate);
    //   if (this.updateApprovalDurationDays) {
    //     let approvalDate = new Date(reviewDate);
    //     approvalDate.setDate(reviewDate.getDate() + parseInt(this.updateApprovalDurationDays));
    //     // this.ApprovalDeadlineDate = new Date(approvalDate);
    //       this.ApprovalDeadlineDate = approvalDate.toISOString().split('T')[0];

    //   }
    // },
    // ApprovalDeadlineDate(newDate) {
    //   let approvalDate = new Date(newDate);
    //   if (this.updatePublicationLeadDays) {
    //     let publicationDate = new Date(approvalDate);
    //     publicationDate.setDate(approvalDate.getDate() + parseInt(this.updatePublicationLeadDays));
    //     // this.PublicationDate = new Date(publicationDate);
    //       this.PublicationDate = publicationDate.toISOString().split('T')[0];

    //   }
    // },
    // PublicationDate(newDate) {
    //   let publicationDate = new Date(newDate);
    //   if (this.updateDocumentValidityDays) {
    //     let expiryDate = new Date(publicationDate);
    //     expiryDate.setDate(publicationDate.getDate() + parseInt(this.updateDocumentValidityDays));
    //     // this.ExpiryDate = new Date(expiryDate);
    //       this.ExpiryDate = expiryDate.toISOString().split('T')[0];
    //   }
    // }
  },
  created() {
    this.updateDate();
    let getitem = localStorage.getItem("versionlist")
    console.log("getitem", getitem)

    if (getitem == null) {
      localStorage.setItem("versionlist", JSON.stringify(this.versionslist));
    }
    this.newVersionList = JSON.parse(localStorage.getItem("versionlist"))
    console.log("newVersionList", this.newVersionList)
    this.updateDateFromReviewDate();

  },

}
</script>
<style>
.selectfield .v-text-field fieldset,
.v-text-field .v-input__control {
  width: 192px !important;
}

.v-text-field.v-text-field--enclosed .v-text-field__details {
  display: none !important;
}

.editfield .v-input__slot {
  /* width: 45%!important; */
}

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
  margin-bottom: 15px;
  height: 8vh !important;
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
