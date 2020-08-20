package com.bookuploader.parser;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

class FB2Parser extends BookParser {
    private final int MAX_FB2INFO_SIZE = 8192;
    private final int MAX_XMLINFO_SIZE = 80;

    private Pattern xmlEncoding = Pattern.compile("(?i).*encoding=[\"'](.*?)[\"'].*");
    private Pattern rAnnotation = Pattern.compile("(?s)<annotation.*?>(.*?)</annotation>");
    private Pattern rFirstName = Pattern.compile("(?s)<first-name.*?>(.*)</first-name>");
    private Pattern rLastName = Pattern.compile("(?s)<last-name.*?>(.*)</last-name>");
    private Pattern rAuthor = Pattern.compile("(?s)<author.*?>(.*?)</author>");
    private Pattern rTitle = Pattern.compile("(?s)<book-title.*?>(.*?)</book-title>");

    FB2Parser(String path) {
        this.path = path;
        format = ".fb2";
    }

    @Override
    EbookMetadata parse() throws IOException {
        if (this.path.endsWith(".zip")) {
            this.parseZip();
        }

        this.parseBook();
        this.renameFile();

        return new EbookMetadata(path, title, author);
    }

    private void parseBook() throws IOException {
        String source = this.createSource(new FileInputStream(this.path));
        Matcher matcher = rAuthor.matcher(source);

        if (matcher.find()) {
            author = extractPerson(matcher.group(1));
        }
        matcher = rTitle.matcher(source);

        if (matcher.find())
            title = matcher.group(1);
    }

    private void parseZip() throws IOException {
        File zip = new File(this.path);
        File destDir = zip.getParentFile();
        byte[] buffer = new byte[1024];
        ZipInputStream zis = new ZipInputStream(new FileInputStream(zip));
        ZipEntry zipEntry = zis.getNextEntry();

        while (zipEntry != null) {
            if (zipEntry.getName().endsWith(".fb2")) {
                File newFile = newFile(destDir, zipEntry);
                FileOutputStream fos = new FileOutputStream(newFile);
                int len;
                while ((len = zis.read(buffer)) > 0) {
                    fos.write(buffer, 0, len);
                }
                fos.close();
                this.path = newFile.getAbsolutePath();
                break;
            }

            zipEntry = zis.getNextEntry();
        }
        zis.closeEntry();
        zis.close();
        zip.delete();
    }

    private File newFile(File destinationDir, ZipEntry zipEntry) throws IOException {
        File destFile = new File(destinationDir, zipEntry.getName());

        String destDirPath = destinationDir.getCanonicalPath();
        String destFilePath = destFile.getCanonicalPath();

        if (!destFilePath.startsWith(destDirPath + File.separator)) {
            throw new IOException("Entry is outside of the target dir: " + zipEntry.getName());
        }

        return destFile;
    }

    private String createSource(InputStream stream) throws IOException,
            NullPointerException {
        byte[] buffer = readInputStream(stream);
        String encoding = this.getXmlEncoding(buffer);
        String preparedInput = new String(buffer, encoding);
        Matcher matcher =  rAnnotation.matcher(preparedInput);
        if (matcher.find()) {
            preparedInput = matcher.replaceFirst("");
        }
        return preparedInput;
    }

    private byte[] readInputStream(InputStream input) throws IOException {
        byte[] buffer = new byte[MAX_FB2INFO_SIZE];
        int counter = 0;
        int amount = 0;
        int stopCounter = 0;
        boolean stop = false;
        while (!stop & (amount < MAX_FB2INFO_SIZE) && (counter != -1)) {
            counter = input.read(buffer, amount, MAX_FB2INFO_SIZE - amount);
            amount += counter;
            while (stopCounter < amount) {
                if (buffer[stopCounter] == '>')
                    if (buffer[stopCounter - 1] == 'o')
                        if (buffer[stopCounter - 12] == '<')
                            if (buffer[stopCounter - 10] == 't') {
                                stop = true;
                                break;
                            }
                stopCounter++;
            }
        }
        if (amount <= 0)
            throw new IOException("Epmty input stream");
        byte[] output = new byte[stopCounter];
        System.arraycopy(buffer, 0, output, 0, stopCounter);
        return output;
    }

    private String getXmlEncoding(byte[] input) throws IOException {
        String encoding = null;
        String xmlHeader = new String(input, 0, MAX_XMLINFO_SIZE, "ISO-8859-1");
        Matcher matcher = xmlEncoding.matcher(xmlHeader.toString());
        if (matcher.find())
            encoding = matcher.group(1);
        else
            throw new IOException("Unknown encoding");
        return encoding;
    }

    private String extractPerson(String input) {
        String firstName = null;
        String lastName = null;

        Matcher matcher;
        matcher = rFirstName.matcher(input);
        if (matcher.find())
            firstName = matcher.group(1).trim();
        matcher = rLastName.matcher(input);
        if (matcher.find())
            lastName = matcher.group(1).trim();

        if (!emt(firstName)) {
            if (!emt(lastName)) return firstName + " " + lastName;

            return firstName;
        }

        return lastName;
    }
}
