# Getting Started with Ollama and Open‑Source LLMs

This guide helps you install Ollama and run **open‑source** large language models (LLMs) entirely on your machine. You'll find system‑specific recommendations for Core i5, Core i7, and GPU‑equipped workstations.

---

## 1. Download & Install Ollama

Visit the official website to grab the latest installer for your OS:

**[https://ollama.com/download](https://ollama.com/download)**

* **macOS/Linux**: Download the script or `.dmg` and follow the on‑screen instructions.
* **Windows**: Download the `.exe` installer and run it.

After installation, verify with:

```bash
ollama version
```

---

## 2. Open‑Source Model Highlights

### DeepSeek Series

* **`deepseek-r1:1.5b`** (\~1.2 GB)

  * **Hardware**: Core i5+, 8 GB RAM
  * **Use cases**: Lightweight chatbots, Q\&A, simple code suggestions
  * **Install**: `ollama pull deepseek-r1:1.5b`

* **`deepseek-r1:7b`** (\~4 GB)

  * **Hardware**: Core i7 or 16 GB RAM (CPU) or entry‑level GPU
  * **Use cases**: Multi‑turn dialogue, moderate context generation
  * **Install**: `ollama pull deepseek-r1:7b`

### Qwen Series

* **`qwen2.5-coder:latest`** (\~5 GB)

  * **Hardware**: Core i7, 16 GB+ RAM or any GPU with ≥4 GB VRAM
  * **Use cases**: Code generation, data transformation, scripting tasks
  * **Install**: `ollama pull qwen2.5-coder:latest`

* **`qwen7b-chat:latest`** (\~7 GB)

  * **Hardware**: GPU with ≥8 GB VRAM or high‑end desktop CPU
  * **Use cases**: Conversational AI, tutoring, translation
  * **Install**: `ollama pull qwen7b-chat:latest`

### GPT4All Series

* **`gpt4all-j`** (\~600 MB)

  * **Hardware**: Core i5, 8 GB RAM
  * **Use cases**: Quick chat, prototyping, offline assistants
  * **Install**: `ollama pull gpt4all-j`

---

## 3. Hardware Tiers & Model Mapping

1. **Core i5 (4–6 cores, 8–16 GB RAM)**

   * Models: `deepseek-r1:1.5b`, `gpt4all-j`
   * Best for: Personal assistants, brief summaries, simple code snippets

2. **Core i7 (8–12 cores, 16–32 GB RAM)**

   * Models: `deepseek-r1:7b`, `qwen2.5-coder`
   * Best for: More complex code generation, research summaries, longer text

3. **GPU Workstation (≥8 GB VRAM)**

   * Models: `qwen7b-chat`
   * Best for: Real‑time chat, multi‑modal tasks, heavy context windows

---

## 4. Best Practices

* **Quantization**: Choose `-q4` variants if available to reduce RAM usage.
* **Batch Requests**: Group prompts when doing bulk processing.
* **Resource Monitoring**: Use `htop` (CPU/RAM) or `nvidia-smi` (GPU).
* **Keep Models Updated**: `ollama update` to fetch latest improvements.

---

## 5. Troubleshooting

* **Out of Memory**: Switch to a smaller model (e.g., 1.5b) or quantized variant.
* **Slow Performance (CPU)**: Lower batch size or upgrade to a GPU-enabled machine.
* **Download Failures**: Retry on a stable connection or via a mirror.

---

Enjoy experimenting with these open‑source LLMs locally! Ollama makes it seamless to switch between models as your projects evolve.
