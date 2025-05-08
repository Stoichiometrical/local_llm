# Master: Your Ollama‑Powered Local LLM Chat App

This project shows you how to run open‑source large language models (LLMs) locally using [Ollama](https://ollama.com) and a simple Python front‑end. You’ll learn how to clone the repo, install Ollama, download models, configure the app, and launch both backend and frontend in one go.

---

## 🚀 Prerequisites

* **OS**: Windows, macOS, or Linux
* **Git**: to clone the repository
* **Internet connection**: for initial downloads
* **Disk**: at least 10 GB free

---

## 🔧 Quick Setup

1. **Clone this repository**

   ```bash
   git clone https://github.com/Stoichiometrical/local_llm.git
   cd local_llm
   ```

2. **Install Ollama** (choose one):

   * **GUI**: Visit [https://ollama.com/download](https://ollama.com/download) and follow the installer
   * **CLI**:

     ```bash
     # macOS / Linux (Homebrew)
     brew install ollama
     # or official script
     curl -sSf https://ollama.com/install.sh | sh

     # Windows (Winget)
     winget install Ollama.Ollama
     ```

3. **Verify Ollama**

   ```bash
   ollama --version
   ```

4. **Download your models**
   Pick from the open‑source options below and run:

   ```bash
   ollama pull deepseek-r1:1.5b
   ollama pull deepseek-r1:7b
   ollama pull qwen2.5-coder:latest
   ollama pull qwen7b-chat:latest
   ollama pull gpt4all-j
   ```

---

## 📥 Downloading Models

| Model                  | Size     | Recommended Hardware       | Pull Command                       |
| ---------------------- | -------- | -------------------------- | ---------------------------------- |
| `deepseek-r1:1.5b`     | \~1.2 GB | Core i5, 8 GB RAM          | `ollama pull deepseek-r1:1.5b`     |
| `deepseek-r1:7b`       | \~4 GB   | Core i7 / 16 GB RAM or GPU | `ollama pull deepseek-r1:7b`       |
| `qwen2.5-coder:latest` | \~5 GB   | Core i7 / 16 GB RAM or GPU | `ollama pull qwen2.5-coder:latest` |
| `qwen7b-chat:latest`   | \~7 GB   | GPU ≥ 8 GB VRAM            | `ollama pull qwen7b-chat:latest`   |
| `gpt4all-j`            | \~600 MB | Core i5, 8 GB RAM          | `ollama pull gpt4all-j`            |

> **Tip**: Quantized variants (e.g. `-q4`) reduce memory usage.

---

## ⚙️ Configure the App

1.Make sure that python and nodejs are installed on your computer.If not donwload them from thier official websites and install before starting

2. If ollama models are installed, begin 
3. **Edit `app.py`** and update the `AVAILABLE_MODELS` list:

   ```python
   AVAILABLE_MODELS = [
     "deepseek-r1:1.5b",
     "deepseek-r1:7b",
     "qwen2.5-coder:latest",
     "qwen7b-chat:latest",
     "gpt4all-j"
   ]
   ```

> The app will only list models present in `AVAILABLE_MODELS`.

---

## ▶️ Launching the App

1. **Run the launcher script**

   * **Windows**: double‑click `llm_executor.bat` or run in PowerShell:

     ```powershell
     .\llm_executor.bat
     ```
   * **macOS/Linux**: make it executable then run:

     ```bash
     chmod +x llm_executor.sh
     ./llm_executor.sh
     ```

2. **Watch the logs** as it:

   * Installs frontend (`npm install`)
   * Sets up Python venv and dependencies
   * Starts Flask backend
   * Starts Vite frontend

3. **Open your browser** at:

   ```text
   http://localhost:5173
   ```

4. **Select a model**, enter prompts, and chat away!

---

## 🛠️ Troubleshooting

* **Model not listed**: Check spelling in `AVAILABLE_MODELS` vs. `ollama list`.
* **OOM errors**: Use a smaller or quantized model.
* **Slow CPU**: Switch to GPU if available or use lighter models.
* **Permission errors** (macOS/Linux):

  ```bash
  chmod +x llm_executor.sh
  ```

---

## 🎉 Enjoy

You’re now running open‑source LLMs locally with Ollama. Experiment freely, integrate into your own projects, and share feedback or contributions on GitHub!
