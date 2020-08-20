package com.bookuploader.parser;

import java.io.IOException;
import java.io.InputStream;
import java.util.Enumeration;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

class EPUBParser extends BookParser {
    private final int MAX_EPUBINFO_SIZE = 8192;
    private final int MAX_XMLINFO_SIZE = 80;

    private Pattern rDescription = Pattern.compile("(?s)<dc:description>(.*?)</dc:description>");
    private Pattern rXmlEncoding = Pattern.compile("(?i).*encoding=[\"'](.*?)[\"'].*");
    private Pattern rTitle = Pattern.compile("(?s)<dc:title>(.*?)</dc:title>");
    private Pattern rAuthor = Pattern.compile("(?s)<dc:creator.*?>(.*?)</dc:creator>");

    EPUBParser(String path) {
        this.path = path;
        format = ".epub";
    }

    @Override
    EbookMetadata parse() throws IOException {
        String source = this.createSource();
        Matcher matcher = rTitle.matcher(source);

        if (matcher.find())
            title = matcher.group(1);

        matcher = rAuthor.matcher(source);
        if (matcher.find()) {
            author = matcher.group(1);
        }

        this.renameFile();

        return new EbookMetadata(path, title, author);
    }

    private String createSource() throws IOException {
        ZipEntry entry = null;
        ZipFile zipFile = new ZipFile(path);
        Enumeration<? extends ZipEntry> zipEntries = zipFile.entries();
        while (zipEntries.hasMoreElements()) {
            entry = zipEntries.nextElement();
            if (entry.getName().matches("(?i).*\\.opf$"))
                break;
        }
        InputStream inputStream = zipFile.getInputStream(entry);
        byte[] buffer = readInputStream(inputStream);
        String encoding = getXmlEncoding(buffer);
        String preparedInput = new String(buffer, encoding);
        Matcher matcher = rDescription.matcher(preparedInput);
        if (matcher.find()) {
            preparedInput = matcher.replaceFirst("");
        }
        return preparedInput;
    }

    private byte[] readInputStream(InputStream input) throws IOException {
        byte[] buffer = new byte[MAX_EPUBINFO_SIZE];
        int counter = 0;
        int amount = 0;
        int stopCounter = 0;
        boolean stop = false;
        while (!stop & (amount < MAX_EPUBINFO_SIZE) && (counter != -1)) {
            counter = input.read(buffer, amount, MAX_EPUBINFO_SIZE - amount);
            amount += counter;
            while (stopCounter < amount) {
                if (buffer[stopCounter] == '>')
                    if (buffer[stopCounter - 1] == 'a')
                        if (buffer[stopCounter - 10] == '<')
                            if (buffer[stopCounter - 9] == '/') {
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
        Matcher matcher = rXmlEncoding.matcher(xmlHeader.toString());
        if (matcher.find())
            encoding = matcher.group(1);
        else
            throw new IOException("Unknown encoding");
        return encoding;
    }
}
