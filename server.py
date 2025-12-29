from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import csv
import io

from classify import classify

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=[" *"],
)

# API Routes MUST  come BEFORE static file serving
@app.post("/classify/")
async def classify_logs(file: UploadFile):
    filename = file.filename.lower()
    if not (filename.endswith('.csv') or filename.endswith('.txt') or filename.endswith('.log')):
        raise HTTPException(status_code=400, detail="File must be a CSV, TXT, or LOG file.")
    
    try:
        content = await file.read()
        text_content = content.decode('utf-8')
        
        rows = []
        fieldnames = []
        
        if filename.endswith('.csv'):
            csv_file = io.StringIO(text_content)
            reader = csv.DictReader(csv_file)
            
            if not reader.fieldnames or "source" not in reader.fieldnames or "log_message" not in reader.fieldnames:
                 raise HTTPException(status_code=400, detail="CSV must contain 'source' and 'log_message' columns.")
            
            fieldnames = reader.fieldnames
            rows = list(reader)
            logs_to_classify = [(row.get("source", ""), row.get("log_message", "")) for row in rows]
        else:
            lines = text_content.splitlines()
            fieldnames = ["source", "log_message"]
            for line in lines:
                if line.strip():
                    rows.append({"source": "NativeLog", "log_message": line.strip()})
            logs_to_classify = [("NativeLog", row["log_message"]) for row in rows]
        
        if not rows:
            raise HTTPException(status_code=400, detail="File is empty or contains no valid logs.")

        labels = classify(logs_to_classify)
        
        for row, label in zip(rows, labels):
            row["target_label"] = label
        
        print(f"Processed {filename} - rows count: {len(rows)}")

        output = io.StringIO()
        final_fieldnames = fieldnames + ["target_label"]
        writer = csv.DictWriter(output, fieldnames=final_fieldnames)
        writer.writeheader()
        writer.writerows(rows)
        
        output.seek(0)
        
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=classified_{file.filename}.csv"}
        )

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await file.close()

# Serve static files - MUST come AFTER API routes
dist_path = Path("frontend/dist")
if dist_path.exists():
    app.mount("/assets", StaticFiles(directory=str(dist_path / "assets")), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        return FileResponse(dist_path / "index.html")