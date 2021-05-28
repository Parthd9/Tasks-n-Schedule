import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "../material.module";
import { SharedModule } from "../shared/shared.module";
import { AuthRoutingModule } from "./auth-routing.module";
import { LoginComponent } from "./login/login.component";
import { PaymentComponent } from "./payment/payment.component";
import { RegisterComponent } from "./register/register.component";

@NgModule({
    declarations: [
        RegisterComponent,
        PaymentComponent,
        LoginComponent
    ],
    imports: [
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        AuthRoutingModule,
        MaterialModule,
        SharedModule
    ]
})

export class AuthModule {}