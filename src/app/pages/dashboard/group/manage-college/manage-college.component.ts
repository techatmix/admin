import { Component, OnInit } from '@angular/core';
import { ngxCsv } from 'ngx-csv';
import { ApiUrls } from 'src/app/config/ApiUrls';
import { MainserviceService } from 'src/app/service/mainservice.service';
declare var $ : any;
@Component({
  selector: 'app-manage-college',
  templateUrl: './manage-college.component.html',
  styleUrls: ['./manage-college.component.scss']
})
export class ManageCollegeComponent implements OnInit {
  itemPerPage = 10;
  currentPage = 1;
  total: any;
  groupList: any = [];
  collegeId: any;
  groupStatus: any;
  userCsvArr: any = [];
  constructor(private service : MainserviceService) { }

  ngOnInit(): void {
    this.collegeListApi()
  }

  collegeListApi() {
    const data = {
      search : ""
    }
    this.service.showSpinner();
    this.service.getApi(ApiUrls.college_list + `?pageNumber=${this.currentPage}&limit=${this.itemPerPage}` ,1).subscribe((res)=>{
     this.service.hideSpinner();
     if (res.responseCode==200){
       this.groupList = res.result ?  res.result : [] ;  
       this.total = res.paginationData.total ;
       this.groupList.forEach((ele,index) => {
        let   date = new Date(ele.createdAt);
        let year = date.getFullYear();
        let month:any = date.getMonth()+1;
        let dt:any = date.getDate();
  
         if (dt < 10) {
           dt = '0' + dt;
         }
         if (month < 10) {
           month = '0' + month;
         }
         let finalDate = dt+'/'+month+'/'+year;
        this.userCsvArr.push({
         "Sr. No." : index+1,
         "University Name" : ele.groupId.groupName,
         "Program Name" :ele.programId.programName,
         "College Name" : ele.collegeName ,
         "Added on" : finalDate,
       })
      });
      }
     else{
      this.groupList = res.result ?  res.result : [] ;  
       this.service.errorToast(res.responseMessage)
     }
   },err=>{
     this.service.hideSpinner();
    this.service.errorToast(err.responseMessage)
    })
  }

  pagination(event) {
    // this.userList = [];
    this.currentPage = event;
    this.collegeListApi() ;

  }


  openDeleteModal(id){
    this.collegeId = id ;
    $('#deleteUser').modal('show')
 }

 deleteUser(){
  const data = {
    collegeId : this.collegeId,
    status : "DELETE"
  }
  this.service.postApi(ApiUrls.actionPerform_college , data ,1).subscribe((res)=>{
    if (res.responseCode == 200){
      $('#deleteUser').modal('hide')
      this.service.successToast(res.responseMessage)
      this.collegeListApi() ;
    }
    else{
      this.service.errorToast(res.responseMessage)
    }
  })

}

openActiveBlock(status , id){
  this.groupStatus = status;
  this.collegeId = id;
  $('#actBlockStatus').modal('show')
}

ExportCsv(){
  var options = { 
   showLabels: true, 
   headers: ["Sr. No.", "University Name","Program Name", "College Name" ,"Added on"]
 };
 new ngxCsv(this.userCsvArr, 'Manage College Report' ,options);    
}

updateActiveBlock(){
  this.groupStatus == 'ACTIVE'? this.groupStatus = 'BLOCK' : this.groupStatus = 'ACTIVE';
  const data = {
    collegeId : this.collegeId,
    status : this.groupStatus
  }
  this.service.postApi(ApiUrls.actionPerform_college , data ,1).subscribe((res)=>{
    if (res.responseCode == 200){
      $('#actBlockStatus').modal('hide')
      this.service.successToast(res.responseMessage)
      this.collegeListApi() ;
    }
    else{
      this.service.errorToast(res.responseMessage)
    }
  })
 }

}
