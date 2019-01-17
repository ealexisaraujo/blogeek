$(() => {
  $('.tooltipped').tooltip({ delay: 50 })
  $('.modal').modal()

   // Init Firebase nuevamente
   firebase.initializeApp(varConfig);

  // TODO: Adicionar el service worker
  navigator.serviceWorker.register('notificaciones-sw.js')
  .then(registro => {
    console.log('service worker registrado')
    firebase.messaging().useServiceWorker(registro)
  }).catch(error => {
    console.log(`Error al registrar el service worker => ${error}`)
  })
  // TODO: Registrar credenciales
  const messaging  = firebase.messaging()
  messaging.usePublicVapidKey(
    'BNZhn4wGUBLYQZfRjgN_1IPt1CjDG7CPR1I3EArbh6AspkhJVvdn9kpeirvv5zh1FqcUPiqfcTsHnACcCSWFJGU'
  )

  // TODO: Solicitar permisos para las notificaciones
  messaging
    .requestPermission()
    .then(() => {
      console.log('permiso otorgado')
      return messaging.getToken()
    })
    .then(token => {
      console.log('token')
      console.log(token)
      sessionStorage.setItem('token', token)
      const db = firebase.firestore()
      db.settings({ timestampsInSnapshots: true })
      db.collection('tokens')
        .add({
          token: token
        })
        .catch(err => {
          console.error(`Error insertando el token en la BD => ${err}`)
        })
    })
    .catch(function (err) {
      console.error(`No se dio el permiso para la notificación => ${err}`)
    })

  // Obtener token cuando se hace refresh
  messaging.onTokenRefresh(() => {
    messaging
      .getToken()
      .then(refreshedToken => {
        console.log('Token refreshed.')
        sessionStorage.setItem('token', refreshedToken)
        const db = firebase.firestore()
        db.settings({ timestampsInSnapshots: true })
        db.collection('tokens')
          .doc(refreshedToken)
          .update({
            token: refreshedToken
          })
          .catch(err => {
            console.error(`Error al actualizar el token a la BD => ${err}`)
          })
      })
      .catch(err => {
        console.log(`No es posible recuperar el token actualizado => ${err}`)
      })
  })

  // TODO: Recibir las notificaciones cuando el usuario esta foreground
  messaging.onMessage(payload => {
    Materialize.toast(`Ya tenemos un nuevo post. Revisalo, se llama ${payload.data.titulo}`, 6000)
  })

  // TODO: Recibir las notificaciones cuando el usuario esta background

  // TODO: Listening real time
  const post = new Post()
  post.consultarTodosPost()
  

  // TODO: Firebase observador del cambio de estado
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      $('#btnInicioSesion').text('Salir')
      if (user.photoURL) {
        $('#avatar').attr('src', user.photoURL)
      } else {
        $('#avatar').attr('src', 'imagenes/usuario_auth.png')
      }
    } else {
      $('#btnInicioSesion').text('Iniciar Sesión') 
      $('#avatar').attr('src', 'imagenes/usuario.png')
    }
  })

  // TODO: Evento boton inicio sesion
  $('#btnInicioSesion').click(() => {
    const user = firebase.auth().currentUser
    if (user) {
      $('#btnInicioSesion').text('Iniciar Sesión')
      return firebase.auth().signOut().then(() => {
        $('#avatar').attr('src', 'imagenes/usuario.png')
        Materialize.toast(`SignOut Correcto`, 4000)
      }).catch (error => {
        Materialize.toast(`Error al realizar SignOut ${error}`, 4000)
      })
    }
    

    $('#emailSesion').val('')
    $('#passwordSesion').val('')
    $('#modalSesion').modal('open')
  })

  $('#avatar').click(() => {
    firebase.auth().signOut()
    .then(() => {
      $('#avatar').attr('src', 'imagenes/usuario.png')
      Materialize.toast(`SignOut correcto`, 4000)
    })
    .catch(error => {
      Materialize.toast(`Error al realizar SignOut ${error}`, 4000)
    })
  })

  $('#btnTodoPost').click(() => {
    $('#tituloPost').text('Posts de la Comunidad')
    const post = new Post()
    post.consultarTodosPost()
  })

  $('#btnMisPost').click(() => {
    const user = firebase.auth().currentUser
    if (user) {
      const post = new Post()
      post.consultarPostxUsuario(user.email)
      $('#tituloPost').text('Mis Posts')
    } else {
      Materialize.toast(`Debes estar autenticado para ver tus posts`, 4000)
    }
  })
})
