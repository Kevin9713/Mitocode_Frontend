import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment.development';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-myaccount',
  standalone: true,
  imports: [],
  templateUrl: './myaccount.component.html',
  styleUrl: './myaccount.component.css'
})
export class MyaccountComponent implements OnInit{

  username: string;
  rol: string;

  constructor(
    private menuService: MenuService
  ){}

  ngOnInit(): void {
    const helper = new JwtHelperService();
    const token = sessionStorage.getItem(environment.TOKEN_NAME);
    const decodedToken = helper.decodeToken(token);

    this.username = decodedToken.sub;
    this.rol = decodedToken.role;
    this.menuService.getMenusByUser(this.username).subscribe(data =>
      this.menuService.setMenuChange(data)
    );
  }
}
