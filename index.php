<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>JSON to XML</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="colorlib.com">
    <!-- MATERIAL DESIGN ICONIC FONT -->
    <link rel="stylesheet" href="fonts/material-design-iconic-font/css/material-design-iconic-font.css">
    <!-- STYLE CSS -->
    <link rel="stylesheet" href="css/style.css">
    <style>
      .button {
        background-color: #4CAF50;
        border: none;
        color: white;
        padding: 15px 32px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div id="wizard">
        <section>
          <form action="upload.php" method="post" enctype="multipart/form-data">
            <div class="form-header">
              <div class="avartar">
                <div class="avartar-picker">
                  <input type="file" name="file" id="file-1" class="inputfile" data-multiple-caption="{count} files selected" multiple />
                  <label for="file-1">
                    <i class="zmdi zmdi-camera"></i>
                    <span>Dosyayı seç</span>
                  </label>
                </div>
              </div>
              <div class="form-group">
                <div class="form-holder active">
                  <input type="text" name="dosyaisim" placeholder="Çıktı Dosya İsmi" class="form-control" required>
                </div>
                <div class="form-holder">
                  <select name="dosyauzanti" id="color" class="form-control">
                    <option value="">--- Dosya Uzantısı ---</option>
                    <option value="doc">doc</option>
                    <option value="xml">xml</option>
                    <option value="docx">docx</option>
                  </select>
                </div>
              </div>
              <div>
                <input type="submit" name="submit" class="button" value="Dosyayı İşle">
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
    <script src="js/jquery-3.3.1.min.js"></script>
    <!-- JQUERY STEP -->
    <script src="js/jquery.steps.js"></script>
    <script src="js/main.js"></script>
    <!-- Template created and distributed by Colorlib -->
  </body>
</html>