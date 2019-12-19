import { Injectable } from '@angular/core';
import { Subject, Subscription  } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { User } from 'src/app/model/user';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Event, Solicitation } from 'src/app/model/event';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authData = new Subject<User>();
  authData$ = this.authData.asObservable();
  authStateSub: Subscription;
  user: User;

  constructor(
      private fireStore: AngularFirestore,
      private fireAuth: AngularFireAuth) {
    this.authStateSub = this.fireAuth.authState.subscribe(userData => {
      if (userData) {
        this.getUserData(userData.uid).then(user => {
          this.user = user;
          this.authData.next(user);
        });
      } else {
        this.user = null;
        this.authData.next(null);
      }
    });
  }

  googleLoggin(): void {
    this.authLogin(new auth.GoogleAuthProvider());
  }

  loggout() {
    this.user = null;
    this.fireAuth.auth.signOut();
    this.authData.next(null);
  }

  private authLogin(provider: auth.AuthProvider): void {
    this.fireAuth.auth
      .signInWithPopup(provider)
      .then(result => {
        this.user = this.toUser(result.user);
        this.authData.next(this.user);
        this.setUserData(this.user);
      })
      .catch(error => {
        window.alert(error);
      });
  }

  private toUser(fbuser: firebase.User): User {
    return {
      uid: fbuser.uid,
      email: fbuser.email,
      displayName: fbuser.displayName,
      photoURL: fbuser.photoURL,
    };
  }

  private setUserData(user: User): Promise<void> {
    const ref: AngularFirestoreDocument<any> = this.fireStore.doc(
      `users/${user.uid}`
    );
    return ref.set(user, {merge: true});
  }

  private async getUserData(uid: string): Promise<User> {
    return this.fireStore.doc(`users/${uid}`)
      .get().pipe(
        map(snapshot => snapshot.data() as User)
      ).toPromise();
  }

  async userCanAccessEvent(eventId: string): Promise<boolean> {
    return this.userEvents(this.user.uid, eventId)
      .get().pipe(
        map(snapshot => !!snapshot.data())
      ).toPromise();
  }

  private userEvents(userId: string, eventId: string): AngularFirestoreDocument<any> {
    return this.fireStore
      .collection('users').doc(userId)
      .collection('events').doc<any>(eventId);
  }

  async addEventAccessSolicitation(eventId: string) {
    this.solicitation$(eventId, this.user.uid)
      .set({
        _userId: this.user.uid,
        _eventId: eventId,
        _userName: this.user.displayName,
      }, {merge: true});
  }

  grantEventAccess(eventId: string, userId: string): Promise<void> {
    return this.userEvents(userId, eventId)
      .set({});
  }

  removeEventAccessSolicitation(eventId: string, userId: string) {
    this.solicitation$(eventId, userId)
      .delete();
  }

  private solicitation$(eventId: string, userId: string): AngularFirestoreDocument<Solicitation> {
    return this.fireStore
      .collection('events').doc(eventId)
      .collection('solicitations').doc<Solicitation>(userId);
  }

}
