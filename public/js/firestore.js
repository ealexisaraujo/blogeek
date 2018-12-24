class PostDAO {
  constructor () {
    this.db = firebase.firestore()
    const settings = { timestampsInSnapshots: true }
    this.db.settings(settings)
  }

  add (post, id) {
    this.db.collection('posts').doc(id).set({
      titulo: post.titulo,
      descripcion: post.descripcion,
      autor: post.autor,
      fecha: firebase.firestore.FieldValue.serverTimestamp()
    })

    console.log('Se crea post')
  }

  batch () {
    const batch = this.db.batch()

    const ref1 = this.db.collection('posts').doc('123456789')
    batch.set(ref1, { titulo: '123456789' })

    const ref2 = this.db.collection('posts').doc('987654321')
    batch.set(ref2, { titulo: '987654321' })

    const ref3 = this.db.collection('posts').doc('456789')
    batch.set(ref3, { titulo: '456789' })

    batch
      .commit()
      .then(() => {
        console.log('Batch correcto')
      })
      .catch(error => console.error(error))
  }

  addWithKey (post) {
    this.db
      .collection('posts')
      .add({
        titulo: post.titulo,
        descripcion: post.descripcion,
        autor: post.autor,
        fecha: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(docRef => {
        console.log(`UID is => ${docRef.id}`)
      })
  }

  addWithMerge (imagenLink, id) {
    console.log(`Post => ${id}, se agrega imangenlink`)
    this.db.collection('posts').doc(id).set(
      {
        imagenLink: imagenLink
      },
      { merge: true }
    )
  }

  update (imagenLink, id) {
    let refUser = this.db.collection('posts').doc(id)
    console.log(`Post => ${id}, se actualiza imangenlink`)

    refUser.update({
      imagenLink: imagenLink
    })
  }

  updateObject (id) {
    console.log(`Post => ${id}, se agrega post.categoria`)
    let refUser = this.db.collection('posts').doc(id)

    refUser.update({
      'post.categoria': '1'
    })
  }

  deleteFields (id) {
    console.log(`Post => ${id}, se elimina imagenLink`)
    this.db.collection('posts').doc(id).update({
      imagenLink: firebase.firestore.FieldValue.delete()
    })
  }

  delete (id) {
    console.log(`Post => ${id}, se elimina`)
    this.db.collection('posts').doc(id).delete()
  }

  querySingle (id) {
    let ref = this.db.collection('posts').doc(id)
    ref.get().then(respDoc => {
      console.log(`querySingle postID ${id} => ${respDoc.data().titulo}`)
    })
  }

  queryByTitulo (titulo) {
    this.db
      .collection('posts')
      .where('titulo', '==', titulo)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          console.log(
            `queryByTitulo postTitulo ${titulo}=> ${doc.data().titulo}`
          )
        })
      })
  }

  allPosts () {
    this.db
      .collection('posts')
      .orderBy('titulo', 'asc')
      .limit(3)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          console.log(`allPosts con Limit 2 => ${doc.data().titulo}`)
        })
      })
  }

  queryPostsByTituloAndAutor (titulo, autor) {
    this.db
      .collection('posts')
      .where('titulo', '==', titulo)
      .where('autor', '==', autor)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          console.log(
            `queryPostsByTituloAndAutor Titulo:${titulo}, autor:${autor} => ${doc.data().titulo}`
          )
        })
      })
  }
}

$(() => {
  const userDAO = new PostDAO()

  $('#btnAdd').click(() => {
    userDAO.add(
      {
        titulo: 'Test1',
        descripcion: 'Test1 Desc',
        autor: 'juan@gmail.com'
      },
      '14638228'
    )
  })

  $('#btnBatch').click(() => {
    userDAO.batch()
  })

  $('#btnAddKey').click(() => {
    userDAO.addWithKey({
      titulo: 'Test1',
      descripcion: 'Test1 Desc',
      autor: 'juan@gmail.com'
    })
  })

  $('#btnAddWithMerge').click(() => {
    userDAO.addWithMerge('ImageLink', '14638228')
  })

  $('#btnupdate').click(() => {
    userDAO.update('ImageLinkUpdate', '14638228')
  })

  $('#btnUpdateObject').click(() => {
    userDAO.updateObject('14638228')
  })

  $('#btnDeleteFields').click(() => {
    userDAO.deleteFields('14638228')
  })

  $('#btnDelete').click(() => {
    userDAO.delete('14638228')
  })

  $('#btnQuerySingle').click(() => {
    userDAO.querySingle('14638228')
  })

  $('#queryByTitulo').click(() => {
    userDAO.queryByTitulo('Test1')
  })

  $('#queryAllPosts').click(() => {
    userDAO.allPosts()
  })

  $('#queryPostsByTituloAndAutor').click(() => {
    userDAO.queryPostsByTituloAndAutor('Test1', 'juan@gmail.com')
  })
})