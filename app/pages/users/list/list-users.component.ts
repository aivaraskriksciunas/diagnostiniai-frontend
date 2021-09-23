import { Component, OnInit } from '@angular/core';
import { UsersService, IUserResult } from '../../../shared/services/users.service';
import { PaginatedList } from '../../../shared/models/paginated_list.model';
import { UserModel } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss', '../../shared/styles/pages.styles.scss']
})
export class ListUsersComponent implements OnInit {

  public userList: PaginatedList<UserModel>
  public isLoading : boolean = true;
  public selectedUser : IUserResult = null;

  public currentPage : number = 1;
  public resultsPerPage : number = 15;

  constructor( private usersService: UsersService ) { }

  ngOnInit() {
    this.updateUserList();
  }

  public updateUserList() {
    this.isLoading = true;
    this.usersService.getUserList( this.currentPage, this.resultsPerPage )
    .subscribe( result => {
      this.userList = result;
      this.isLoading = false;
    } )
  }

  public selectUser( user : IUserResult ) {
    this.selectedUser = user;
  }

  public deselectUser() {
    this.selectedUser = null;
  }

  public pageChanged( page ) {
    this.currentPage = page;
    this.updateUserList();
  }
}
