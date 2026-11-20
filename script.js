document.querySelector('#annee').textContent = new Date().getFullYear();

const formulaire = document.querySelector('#formulaire');
const secours = document.querySelector('#secours');
const boutonCopier = document.querySelector('#bouton-copier');
const confirmation = document.querySelector('#confirmation');

function lireMessage() {
  const donnees = new FormData(formulaire);

  return {
    destinataire: formulaire.dataset.destinataire,
    objet: donnees.get('objet').trim(),
    corps: [
      donnees.get('message').trim(),
      '',
      'Nom : ' + donnees.get('nom').trim(),
      'E-mail : ' + donnees.get('email').trim()
    ].join('\r\n')
  };
}

formulaire.addEventListener('submit', (evenement) => {
  evenement.preventDefault();

  const { destinataire, objet, corps } = lireMessage();

  secours.hidden = false;
  confirmation.textContent = '';

  window.location.href = 'mailto:' + destinataire
    + '?subject=' + encodeURIComponent(objet)
    + '&body=' + encodeURIComponent(corps);
});

async function copier(texte) {
  try {
    await navigator.clipboard.writeText(texte);
    return true;
  } catch (erreur) {
    const zone = document.createElement('textarea');
    zone.className = 'zone-copie';
    zone.value = texte;
    document.body.append(zone);
    zone.select();
    const reussi = document.execCommand('copy');
    zone.remove();
    return reussi;
  }
}

boutonCopier.addEventListener('click', async () => {
  const { destinataire, objet, corps } = lireMessage();
  const texte = 'À : ' + destinataire + '\r\nObjet : ' + objet + '\r\n\r\n' + corps;
  const reussi = await copier(texte);

  confirmation.textContent = reussi
    ? 'Message copié.'
    : 'La copie a échoué : sélectionnez le texte du formulaire à la main.';
});
