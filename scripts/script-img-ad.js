const objetoId = window.location.search.split('=')[1];

const cargarImgAd = async () => {
    try {
        const rta = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objetoId}`);
        const data = await rta.json();

        let tit = '';
        let cultura = `${data.culture}` || "no tiene";
        let dinastia = `${data.dynasty}` || "no se sabe";
        let creacion = `${data.objectDate}` || "no se sabe";

        tit = `<div>
        <h1>${data.title}</h1>
        <p class="cult-dinas">Cultura: ${cultura}</p>
        <p class="cult-dinas">Dinastia: ${dinastia}</p>
        <p class="cult-dinas">Creacion: ${creacion}</p>
        </div>`;
        document.getElementById('textos').innerHTML = tit;

        data.additionalImages.forEach(element => {
            const img = document.createElement('img');
            img.src = element;
            img.classList.add('img-individual');
            document.getElementById('img-container').appendChild(img);
        });
    } catch (error) {
        console.error('Error al cargar imágenes adicionales:', error);
    }
};
cargarImgAd();
