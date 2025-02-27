"use client";

import { ClipboardPaste, UploadCloud, Trash, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { ChangeEvent, useState } from "react";
import { If, Show, useBoolToggle, useMediaQuery } from "react-haiku";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import mammoth from "mammoth";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase.config";
import Navbar from "@/components/navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ParagraphSkeleton } from "@/components/paragraph-skeleton";
import { Summary } from "@/components/summary";
import { wordCount } from "@/lib/utils";

const formSchema = z.object({
  text: z.string().min(1, { message: "Please enter some text to summarize" }),
});

type FormValues = z.infer<typeof formSchema>;

function Home() {
  const form = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  const [newText, setNewText] = useState("");
  const [summary, setSummary] = useState("");

  const [isLoading, toggleLoading] = useBoolToggle(false);

  const medBreakpoint = useMediaQuery("(max-width: 925px)");

  const onSubmit = async (data: FormValues) => {
    toggleLoading();

    const newDocRef = await addDoc(collection(db, "articles"), {
      text: data.text,
    });

    setNewText(data.text);

    onSnapshot(newDocRef, (doc) => {
      const newSummary = doc.data()?.summary;
      const state = doc.data()?.status?.state;
      const error = doc.data()?.status?.error;

      if (state === "ERRORED") {
        setSummary(error);
        toggleLoading();
      } else if (state === "COMPLETED") {
        setSummary(newSummary);
        toggleLoading();
      }
    });
  };

  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNewText(value);
    form.setValue("text", value);
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const result = await mammoth.extractRawText({
        arrayBuffer: await file.arrayBuffer(),
      });

      setNewText(result.value);
      form.setValue("text", result.value);
    }
  };

  const pasteText = () => {
    navigator.clipboard.readText().then((pastedText) => {
      setNewText(pastedText);
      form.setValue("text", pastedText);
    });
  };

  return (
    <>
      <Navbar />

      <Show>
        <Show.When isTrue={medBreakpoint}>
          <Tabs defaultValue="inputText" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="inputText">Input</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
            </TabsList>
            <TabsContent value="inputText">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="relative">
                    <FormField
                      control={form.control}
                      name="text"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Enter or paste your text or press 'Summarize'"
                              rows={25}
                              cols={25}
                              {...field}
                              className="resize-none border-none p-8 font-[16px] outline-none"
                              value={newText}
                              onChange={handleTextAreaChange}
                            />
                          </FormControl>
                          <FormMessage className="p-2" />
                        </FormItem>
                      )}
                    />
                    <If isTrue={!form.watch("text") || newText.length === 0}>
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                        <Button
                          variant="outline"
                          type="button"
                          className="flex items-center justify-center px-3 py-8"
                        >
                          <Label htmlFor="wordDoc">
                            <span className="flex items-center">
                              <UploadCloud
                                color="#1c9b4d"
                                className="h-6 w-6"
                              />{" "}
                              &nbsp; Upload Doc
                            </span>
                          </Label>
                          <Input
                            id="wordDoc"
                            type="file"
                            className="hidden"
                            accept=".txt, text/plain, .doc, .docx, application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={handleFileChange}
                          />
                        </Button>
                        <Button
                          variant={"outline"}
                          type="button"
                          className="px-3 py-8"
                          onClick={pasteText}
                        >
                          <ClipboardPaste
                            color="#1c9b4d"
                            className="h-10 w-10"
                          />
                          Paste Text
                        </Button>
                      </div>
                    </If>
                  </div>
                  <div className="mt-5 flex justify-between">
                    <span className="p-3">{wordCount(newText)} Words</span>
                    <Button type="submit" disabled={isLoading}>
                      <Show>
                        <Show.When isTrue={isLoading}>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </Show.When>
                        <Show.Else>Summarize</Show.Else>
                      </Show>
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="summary">
              <div className="flex w-[590px] flex-col justify-between max-[925px]:w-full">
                <Show>
                  <Show.When isTrue={isLoading}>
                    <ParagraphSkeleton />
                  </Show.When>
                  <Show.Else>
                    <Summary content={summary} />
                  </Show.Else>
                </Show>
              </div>
            </TabsContent>
          </Tabs>
        </Show.When>
        <Show.Else>
          <div className="flex justify-center">
            <div className="mt-12 flex w-fit rounded-lg border shadow-2xl">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="relative">
                    <FormField
                      control={form.control}
                      name="text"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Enter or paste your text or press 'Summarize'"
                              rows={25}
                              cols={60}
                              {...field}
                              className="resize-none border-none p-8 text-base outline-none"
                              value={newText}
                              onChange={handleTextAreaChange}
                            />
                          </FormControl>
                          <FormMessage className="p-2" />
                        </FormItem>
                      )}
                    />
                    <If isTrue={!form.watch("text") || newText.length === 0}>
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                        <Button
                          variant={"outline"}
                          type="button"
                          className="px-3 py-8"
                          onClick={pasteText}
                        >
                          <ClipboardPaste
                            color="#1c9b4d"
                            className="h-10 w-10"
                          />
                          Paste Text
                        </Button>
                      </div>
                    </If>
                  </div>
                  <div className="mt-5 flex justify-between">
                    <Show>
                      <Show.When
                        isTrue={!form.watch("text") || newText.length === 0}
                      >
                        <Button
                          variant="ghost"
                          type="button"
                          className="flex items-center justify-center"
                        >
                          <Label htmlFor="wordDoc">
                            <span className="flex items-center">
                              <UploadCloud
                                color="#1c9b4d"
                                className="h-6 w-6"
                              />{" "}
                              &nbsp; Upload Doc
                            </span>
                          </Label>
                          <Input
                            id="wordDoc"
                            type="file"
                            className="hidden"
                            accept=".txt, text/plain, .doc, .docx, application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={handleFileChange}
                          />
                        </Button>{" "}
                      </Show.When>
                      <Show.Else>
                        <span className="p-3">{wordCount(newText)} Words</span>
                      </Show.Else>
                    </Show>
                    <Button type="submit" disabled={isLoading}>
                      <Show>
                        <Show.When isTrue={isLoading}>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </Show.When>
                        <Show.Else>Summarize</Show.Else>
                      </Show>
                    </Button>
                  </div>
                </form>
              </Form>
              <Separator orientation="vertical" />
              <div className="flex w-[590px] flex-col justify-between max-[925px]:w-full">
                <Show>
                  <Show.When isTrue={isLoading}>
                    <ParagraphSkeleton />
                  </Show.When>
                  <Show.Else>
                    <Summary content={summary} />
                  </Show.Else>
                </Show>
              </div>
            </div>
          </div>
        </Show.Else>
      </Show>

      <div className="mt-16 flex items-center justify-center">
        <Button
          variant="destructive"
          onClick={() => {
            setNewText("");
            setSummary("");
          }}
        >
          <Trash />
          Clear all text
        </Button>
      </div>
    </>
  );
}

export default Home;
