importScripts('https://www.gstatic.com/firebasejs/5.5.8/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/5.5.8/firebase-messaging.js')

 // Init Firebase nuevamente
 firebase.initializeApp({
  projectId: "geekblog-e745e",
  messagingSenderId: "688690381695"
 })

 const messaging = firebase.messaging()

 messaging.setBackgroundMessageHandler(payload => {
   const tituloNotificacion = 'Ya tenemos un nuevo post'
   const opcionesNotificacion = {
     body: payload.data.titulo,
     icon: 'icons/icon_new_post.png',
     click_action: "http://geekblog-e745e.firebaseapp.com"
   }

   return self.registration.showNotificacion(
     tituloNotificacion,
     opcionesNotificacion
   )
 })


