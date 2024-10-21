import {useForm} from "react-hook-form";
import * as yup from "yup";
import{ yupResolver} from "@hookform/resolvers/yup";
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

interface CreateFormData {
  title: string;
  description: string;
}


export const CreateForm = () => {
  const [user, loading, error] = useAuthState(auth)

  const schema = yup.object().shape({
    title: yup.string().required("You must add a title."),
    description: yup.string().required("You must add a description."),
  });

  const { register, handleSubmit, formState: {errors} } = useForm({
    resolver: yupResolver(schema),
  });

  const postsRef = collection(db, "posts");

  const onCreatePost = async (data: CreateFormData) => {
    await addDoc(postsRef, {
      /* title: data.title,
      description: data.description, */
      ...data,
      username: user?.displayName,
      userId: user?.uid
    })
  };

  return (
    <form onSubmit={handleSubmit(onCreatePost)}>
      <input placeholder="Title..." {...register("title")}/>
      <p style={{color: "red"}}>{errors.title?.message}</p>
      <textarea placeholder="Description..." {...register("description")}/>
      <p style={{color: "red"}}>{errors.description?.message}</p>
      <input type="submit" className="submitForm"/>
    </form>
  );
}