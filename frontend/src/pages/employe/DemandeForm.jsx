import { useRef, useState } from "react";
import axios from "axios";
import { FaFileAlt } from "react-icons/fa";
import "./DemandeForm.css";

export default function Demande() {
  const [formData, setFormData] = useState({
    objet: "",
    description: "",
    categorie: "",
    fichier: null,
  });

  const [message, setMessage] = useState("");
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    setFormData((prev) => ({
      ...prev,
      fichier: file,
    }));

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.onloadend = () => setFilePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("objet", formData.objet);
    data.append("description", formData.description);
    data.append("categorie", formData.categorie);

    if (formData.fichier) {
      data.append("fichier", formData.fichier);
    }

    axios
      .post("http://localhost:8000/api/accounts/tickets/create/", data, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        setMessage(" Demande envoyée avec succès !");

        setFormData({
          objet: "",
          description: "",
          categorie: "",
          fichier: null,
        });

        setFilePreview(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      })
      .catch((err) => {
        console.error(
          "Erreur lors de l'envoi de la demande :",
          err.response?.data || err.message
        );
        setMessage("❌ Une erreur s’est produite. Vérifiez les champs.");
      });
  };

  return (
    <div className="p-6">
      <div className="titre-principale flex items-center gap-3 mb-8">
        <div>
          <h2 className="text-2xl font-bold">Nouvelle Demande</h2>
          <p className="text-gray-500 text-sm">
            Soumettez un ticket pour signaler un problème ou faire une demande
            d’assistance technique.
          </p>
        </div>
      </div>

      <div className="md:flex gap-6">
        <div className=" md:w-2/3 bg-white p-6 rounded shadow-md">
          {message && (
            <p className="mb-4 text-sm font-semibold text-green-600">
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit} className=" space-y-4">
            <div>
              <label className="block font-medium mb-2 ">Catégorie</label>
              <select
                name="categorie"
                value={formData.categorie}
                onChange={handleChange}
                required
                className=" border p-2 rounded position-inputdemande position-inputdemande2 mb-4 px-4 py-4 border  rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00acc1]"
              >
                <option value="">-- Choisir une catégorie --</option>
                <option value="réseau">Réseau</option>
                <option value="matériel">Matériel</option>
                <option value="logiciel">Logiciel</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Objet</label>
              <input
                type="text"
                name="objet"
                value={formData.objet}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded position-inputdemande mb-4 px-4 py-4 border  rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00acc1]"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded position-inputdemande mb-4 px-4 py-4 border  rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00acc1]"
                rows={4}
              ></textarea>
            </div>

            <div>
              <label className="block font-medium mb-1">
                Pièce jointe (facultatif)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                name="fichier"
                onChange={handleFileChange}
                className="w-full border p-2 rounded position-inputdemande mb-4 px-4 py-4 border  rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00acc1]"
              />

              {filePreview && (
                <div className="mt-2">
                  <img
                    src={filePreview}
                    alt="Aperçu"
                    className="h-32 border rounded"
                  />
                </div>
              )}

              {formData.fichier && !filePreview && (
                <div className="mt-2 flex items-center text-sm text-gray-600">
                  <FaFileAlt className="mr-2" />
                  {formData.fichier.name}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="bg-[#50C3CC] text-white px-6 py-2 rounded hover:bg-[#3ab0b9]"
            >
              Envoyer
            </button>
          </form>
        </div>

        <div className="conseil md:w-1/3 mt-8 md:mt-0 bg-gray-50 p-5 rounded shadow-md text-sm space-y-4">
          <h3 className="font-bold text-[#50C3CC]"> Conseils utiles</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Décrivez clairement votre problème.</li>
            <li>Ajoutez une capture d’écran si possible.</li>
            <li>Mentionnez les étapes déjà tentées.</li>
          </ul>
          <hr className="ligne" />
          <p className="text-gray-600">
             <strong>Délai moyen</strong> de traitement :{" "}
            <span className="font-semibold">24 heures</span>
          </p>
          <p className="text-gray-600">
             Pour plus d’aide :{" "}
            <a href="mailto:support@supmti.ma" className="text-[#50C3CC]">
              support@supmti.ma
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
